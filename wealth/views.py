from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone

from .models import Asset, Liability, NetWorthSnapshot
from .serializers import (
    AssetSerializer,
    LiabilitySerializer,
    NetWorthSnapshotSerializer,
)
from .utils import compute_current_net_worth, create_net_worth_snapshot


class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return getattr(obj, "user", None) == request.user


class AssetViewSet(viewsets.ModelViewSet):
    serializer_class = AssetSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        return Asset.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['post'])
    def sync_from_accounts(self, request):
        """Sync bank accounts as assets - creates or updates assets based on account current balances"""
        from finance.models import Account
        
        accounts = Account.objects.filter(
            user=request.user,
            status='ACTIVE',
            account_type__in=['BANK', 'MOBILE_MONEY', 'SACCO', 'INVESTMENT']
        )
        
        created = []
        updated = []
        
        for account in accounts:
            current_balance = account.calculate_current_balance()
            
            # Map account types to asset types
            asset_type_map = {
                'BANK': 'OTHER',
                'MOBILE_MONEY': 'OTHER',
                'SACCO': 'OTHER',
                'INVESTMENT': 'OTHER',
            }
            
            asset_type = asset_type_map.get(account.account_type, 'OTHER')
            
            # Try to find existing asset linked to this account
            asset = Asset.objects.filter(
                user=request.user,
                linked_account=account
            ).first()
            
            if asset:
                # Update existing asset
                asset.current_value = current_balance
                asset.name = f"{account.name} ({account.institution or account.account_type})"
                asset.save()
                updated.append(asset.id)
            else:
                # Create new asset
                asset = Asset.objects.create(
                    user=request.user,
                    name=f"{account.name} ({account.institution or account.account_type})",
                    asset_type=asset_type,
                    current_value=current_balance,
                    currency=account.currency,
                    linked_account=account
                )
                created.append(asset.id)
        
        return Response({
            'message': f'Synced {len(accounts)} accounts',
            'created': len(created),
            'updated': len(updated),
            'asset_ids': created + updated
        })


class LiabilityViewSet(viewsets.ModelViewSet):
    serializer_class = LiabilitySerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        return Liability.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class NetWorthSnapshotViewSet(viewsets.ModelViewSet):
    serializer_class = NetWorthSnapshotSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        return NetWorthSnapshot.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=["get"])
    def current(self, request):
        data = compute_current_net_worth(request.user)
        return Response(data)

    @action(detail=False, methods=["post"])
    def snapshot(self, request):
        today = timezone.localdate()
        snapshot = create_net_worth_snapshot(request.user, today)
        serializer = self.get_serializer(snapshot)
        return Response(serializer.data)
