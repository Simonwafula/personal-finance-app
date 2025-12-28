from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, F
from decimal import Decimal
from .models import Investment, InvestmentTransaction
from .serializers import (
    InvestmentSerializer,
    InvestmentTransactionSerializer,
    InvestmentSummarySerializer
)


class InvestmentViewSet(viewsets.ModelViewSet):
    """ViewSet for managing investments"""
    serializer_class = InvestmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Investment.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Get summary statistics for all investments"""
        investments = self.get_queryset().filter(status='ACTIVE')
        
        total_invested = Decimal('0')
        total_current_value = Decimal('0')
        by_type = {}
        
        for inv in investments:
            total_invested += inv.total_invested
            total_current_value += inv.current_value
            
            inv_type = inv.get_investment_type_display()
            if inv_type not in by_type:
                by_type[inv_type] = {
                    'count': 0,
                    'invested': Decimal('0'),
                    'current_value': Decimal('0'),
                    'gain_loss': Decimal('0')
                }
            by_type[inv_type]['count'] += 1
            by_type[inv_type]['invested'] += inv.total_invested
            by_type[inv_type]['current_value'] += inv.current_value
            by_type[inv_type]['gain_loss'] += inv.gain_loss
        
        total_gain_loss = total_current_value - total_invested
        total_gain_loss_percentage = (
            (total_gain_loss / total_invested * 100) if total_invested > 0 else Decimal('0')
        )
        
        # Convert by_type decimals to floats for JSON serialization
        for key in by_type:
            by_type[key]['invested'] = float(by_type[key]['invested'])
            by_type[key]['current_value'] = float(by_type[key]['current_value'])
            by_type[key]['gain_loss'] = float(by_type[key]['gain_loss'])
        
        return Response({
            'total_invested': float(total_invested),
            'total_current_value': float(total_current_value),
            'total_gain_loss': float(total_gain_loss),
            'total_gain_loss_percentage': float(total_gain_loss_percentage),
            'investment_count': investments.count(),
            'by_type': by_type
        })

    @action(detail=True, methods=['post'])
    def add_transaction(self, request, pk=None):
        """Add a transaction to an investment"""
        investment = self.get_object()
        serializer = InvestmentTransactionSerializer(data=request.data)
        
        if serializer.is_valid():
            transaction = serializer.save(investment=investment)
            
            # Update investment based on transaction type
            if transaction.transaction_type == 'BUY':
                investment.quantity += transaction.quantity
                # Update average purchase price
                total_cost = (investment.purchase_price * (investment.quantity - transaction.quantity)) + (transaction.price_per_unit * transaction.quantity)
                investment.purchase_price = total_cost / investment.quantity
                investment.purchase_fees += transaction.fees
            elif transaction.transaction_type == 'SELL':
                investment.quantity -= transaction.quantity
                if investment.quantity <= 0:
                    investment.status = 'SOLD'
            elif transaction.transaction_type in ['DIVIDEND', 'INTEREST']:
                # Record dividend/interest - doesn't change quantity
                pass
            elif transaction.transaction_type == 'BONUS':
                investment.quantity += transaction.quantity
            
            investment.save()
            return Response(InvestmentSerializer(investment).data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def update_price(self, request, pk=None):
        """Update the current price of an investment"""
        investment = self.get_object()
        new_price = request.data.get('current_price')
        
        if new_price is None:
            return Response(
                {'error': 'current_price is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        investment.current_price = Decimal(str(new_price))
        investment.save()
        
        return Response(InvestmentSerializer(investment).data)


class InvestmentTransactionViewSet(viewsets.ModelViewSet):
    """ViewSet for managing investment transactions"""
    serializer_class = InvestmentTransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return InvestmentTransaction.objects.filter(
            investment__user=self.request.user
        )
