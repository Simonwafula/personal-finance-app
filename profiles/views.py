from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from django.utils import timezone
import json
from decimal import Decimal
from datetime import datetime

from .models import UserProfile
from .serializers import UserProfileSerializer


class DecimalEncoder(json.JSONEncoder):
    """JSON encoder that handles Decimal types."""
    def default(self, obj):
        if isinstance(obj, Decimal):
            return str(obj)
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)


@api_view(['GET', 'PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    """
    GET: Retrieve current user's profile
    PUT/PATCH: Update current user's profile
    """
    try:
        profile = request.user.profile
    except UserProfile.DoesNotExist:
        # Create profile if it doesn't exist
        profile = UserProfile.objects.create(user=request.user)
    
    if request.method == 'GET':
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)
    
    elif request.method in ['PUT', 'PATCH']:
        partial = request.method == 'PATCH'
        serializer = UserProfileSerializer(profile, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def export_backup(request):
    """
    Export all user data as JSON for backup purposes.
    Includes: accounts, categories, transactions, budgets, savings goals, debts, investments.
    """
    from finance.models import Account, Category, Transaction, RecurringTransaction
    from budgeting.models import Budget
    from savings.models import SavingsGoal
    from debt_planner.models import Debt
    from investments.models import Investment, InvestmentTransaction
    
    user = request.user
    
    # Collect all user data
    backup_data = {
        'export_date': timezone.now().isoformat(),
        'user': {
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
        },
        'profile': None,
        'accounts': [],
        'categories': [],
        'transactions': [],
        'recurring_transactions': [],
        'budgets': [],
        'savings_goals': [],
        'debts': [],
        'investments': [],
        'investment_transactions': [],
    }
    
    # Profile
    try:
        profile = user.profile
        backup_data['profile'] = {
            'phone_number': profile.phone_number,
            'currency': profile.currency,
            'bio': profile.bio,
            'email_notifications': profile.email_notifications,
            'email_budget_alerts': profile.email_budget_alerts,
            'email_recurring_reminders': profile.email_recurring_reminders,
            'email_weekly_summary': profile.email_weekly_summary,
        }
    except UserProfile.DoesNotExist:
        pass
    
    # Accounts
    accounts = Account.objects.filter(user=user)
    account_id_map = {}  # old_id -> account_data for reference
    for acc in accounts:
        account_id_map[acc.id] = acc.name
        backup_data['accounts'].append({
            'id': acc.id,
            'name': acc.name,
            'account_type': acc.account_type,
            'opening_balance': str(acc.opening_balance),
            'current_balance': str(acc.current_balance),
            'currency': acc.currency,
            'description': acc.description,
            'is_active': acc.is_active,
        })
    
    # Categories
    categories = Category.objects.filter(user=user)
    category_id_map = {}
    for cat in categories:
        category_id_map[cat.id] = cat.name
        backup_data['categories'].append({
            'id': cat.id,
            'name': cat.name,
            'kind': cat.kind,
            'color': cat.color,
            'icon': cat.icon,
        })
    
    # Transactions
    transactions = Transaction.objects.filter(user=user)
    for txn in transactions:
        backup_data['transactions'].append({
            'id': txn.id,
            'account_name': account_id_map.get(txn.account_id, ''),
            'category_name': category_id_map.get(txn.category_id, '') if txn.category_id else None,
            'amount': str(txn.amount),
            'kind': txn.kind,
            'date': txn.date.isoformat() if txn.date else None,
            'description': txn.description,
            'notes': txn.notes,
            'tag': txn.tag,
        })
    
    # Recurring Transactions
    recurring = RecurringTransaction.objects.filter(user=user)
    for rec in recurring:
        backup_data['recurring_transactions'].append({
            'id': rec.id,
            'account_name': account_id_map.get(rec.account_id, ''),
            'category_name': category_id_map.get(rec.category_id, '') if rec.category_id else None,
            'amount': str(rec.amount),
            'kind': rec.kind,
            'frequency': rec.frequency,
            'next_date': rec.next_date.isoformat() if rec.next_date else None,
            'description': rec.description,
            'is_active': rec.is_active,
            'tag': rec.tag,
        })
    
    # Budgets
    budgets = Budget.objects.filter(user=user)
    for budget in budgets:
        backup_data['budgets'].append({
            'id': budget.id,
            'category_name': category_id_map.get(budget.category_id, '') if budget.category_id else None,
            'amount': str(budget.amount),
            'period': budget.period,
            'start_date': budget.start_date.isoformat() if budget.start_date else None,
            'end_date': budget.end_date.isoformat() if budget.end_date else None,
            'name': budget.name,
            'rollover': budget.rollover,
        })
    
    # Savings Goals
    savings_goals = SavingsGoal.objects.filter(user=user)
    for goal in savings_goals:
        backup_data['savings_goals'].append({
            'id': goal.id,
            'name': goal.name,
            'target_amount': str(goal.target_amount),
            'current_amount': str(goal.current_amount),
            'deadline': goal.deadline.isoformat() if goal.deadline else None,
            'description': goal.description,
            'is_completed': goal.is_completed,
        })
    
    # Debts
    debts = Debt.objects.filter(user=user)
    for debt in debts:
        backup_data['debts'].append({
            'id': debt.id,
            'name': debt.name,
            'debt_type': debt.debt_type,
            'principal': str(debt.principal),
            'interest_rate': str(debt.interest_rate),
            'minimum_payment': str(debt.minimum_payment),
            'current_balance': str(debt.current_balance),
            'due_date': debt.due_date,
            'start_date': debt.start_date.isoformat() if debt.start_date else None,
            'notes': debt.notes,
        })
    
    # Investments
    investments = Investment.objects.filter(user=user)
    investment_id_map = {}
    for inv in investments:
        investment_id_map[inv.id] = inv.name
        backup_data['investments'].append({
            'id': inv.id,
            'name': inv.name,
            'investment_type': inv.investment_type,
            'ticker_symbol': inv.ticker_symbol,
            'quantity': str(inv.quantity),
            'purchase_price': str(inv.purchase_price),
            'current_price': str(inv.current_price),
            'purchase_date': inv.purchase_date.isoformat() if inv.purchase_date else None,
            'notes': inv.notes,
        })
    
    # Investment Transactions
    inv_transactions = InvestmentTransaction.objects.filter(investment__user=user)
    for inv_txn in inv_transactions:
        backup_data['investment_transactions'].append({
            'id': inv_txn.id,
            'investment_name': investment_id_map.get(inv_txn.investment_id, ''),
            'transaction_type': inv_txn.transaction_type,
            'quantity': str(inv_txn.quantity),
            'price': str(inv_txn.price),
            'date': inv_txn.date.isoformat() if inv_txn.date else None,
            'notes': inv_txn.notes,
        })
    
    # Return as downloadable JSON
    response = JsonResponse(backup_data, encoder=DecimalEncoder, json_dumps_params={'indent': 2})
    response['Content-Disposition'] = f'attachment; filename="finance_backup_{timezone.now().strftime("%Y%m%d_%H%M%S")}.json"'
    return response


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def import_backup(request):
    """
    Import user data from a backup JSON file.
    Handles conflict resolution by using names to match existing records.
    """
    from finance.models import Account, Category, Transaction, RecurringTransaction
    from budgeting.models import Budget
    from savings.models import SavingsGoal
    from debt_planner.models import Debt
    from investments.models import Investment, InvestmentTransaction
    
    if 'file' not in request.FILES:
        return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        file = request.FILES['file']
        backup_data = json.load(file)
    except json.JSONDecodeError:
        return Response({'error': 'Invalid JSON file'}, status=status.HTTP_400_BAD_REQUEST)
    
    user = request.user
    stats = {
        'accounts': {'created': 0, 'updated': 0},
        'categories': {'created': 0, 'updated': 0},
        'transactions': {'created': 0, 'skipped': 0},
        'recurring_transactions': {'created': 0, 'skipped': 0},
        'budgets': {'created': 0, 'updated': 0},
        'savings_goals': {'created': 0, 'updated': 0},
        'debts': {'created': 0, 'updated': 0},
        'investments': {'created': 0, 'updated': 0},
        'investment_transactions': {'created': 0, 'skipped': 0},
    }
    
    # Update profile if present
    if backup_data.get('profile'):
        profile_data = backup_data['profile']
        try:
            profile = user.profile
        except UserProfile.DoesNotExist:
            profile = UserProfile.objects.create(user=user)
        
        for field in ['phone_number', 'currency', 'bio', 'email_notifications',
                      'email_budget_alerts', 'email_recurring_reminders', 'email_weekly_summary']:
            if field in profile_data:
                setattr(profile, field, profile_data[field])
        profile.save()
    
    # Import accounts (match by name)
    account_name_to_id = {}
    for acc_data in backup_data.get('accounts', []):
        account, created = Account.objects.update_or_create(
            user=user,
            name=acc_data['name'],
            defaults={
                'account_type': acc_data.get('account_type', 'CHECKING'),
                'opening_balance': Decimal(acc_data.get('opening_balance', '0')),
                'current_balance': Decimal(acc_data.get('current_balance', '0')),
                'currency': acc_data.get('currency', 'KES'),
                'description': acc_data.get('description', ''),
                'is_active': acc_data.get('is_active', True),
            }
        )
        account_name_to_id[acc_data['name']] = account.id
        if created:
            stats['accounts']['created'] += 1
        else:
            stats['accounts']['updated'] += 1
    
    # Import categories (match by name and kind)
    category_name_to_id = {}
    for cat_data in backup_data.get('categories', []):
        category, created = Category.objects.update_or_create(
            user=user,
            name=cat_data['name'],
            kind=cat_data.get('kind', 'EXPENSE'),
            defaults={
                'color': cat_data.get('color', '#808080'),
                'icon': cat_data.get('icon', ''),
            }
        )
        category_name_to_id[cat_data['name']] = category.id
        if created:
            stats['categories']['created'] += 1
        else:
            stats['categories']['updated'] += 1
    
    # Import transactions
    for txn_data in backup_data.get('transactions', []):
        account_id = account_name_to_id.get(txn_data.get('account_name'))
        if not account_id:
            stats['transactions']['skipped'] += 1
            continue
        
        category_id = category_name_to_id.get(txn_data.get('category_name'))
        
        Transaction.objects.create(
            user=user,
            account_id=account_id,
            category_id=category_id,
            amount=Decimal(txn_data.get('amount', '0')),
            kind=txn_data.get('kind', 'EXPENSE'),
            date=txn_data.get('date'),
            description=txn_data.get('description', ''),
            notes=txn_data.get('notes', ''),
            tag=txn_data.get('tag', ''),
        )
        stats['transactions']['created'] += 1
    
    # Import recurring transactions
    for rec_data in backup_data.get('recurring_transactions', []):
        account_id = account_name_to_id.get(rec_data.get('account_name'))
        if not account_id:
            stats['recurring_transactions']['skipped'] += 1
            continue
        
        category_id = category_name_to_id.get(rec_data.get('category_name'))
        
        RecurringTransaction.objects.create(
            user=user,
            account_id=account_id,
            category_id=category_id,
            amount=Decimal(rec_data.get('amount', '0')),
            kind=rec_data.get('kind', 'EXPENSE'),
            frequency=rec_data.get('frequency', 'MONTHLY'),
            next_date=rec_data.get('next_date'),
            description=rec_data.get('description', ''),
            is_active=rec_data.get('is_active', True),
            tag=rec_data.get('tag', ''),
        )
        stats['recurring_transactions']['created'] += 1
    
    # Import budgets
    for budget_data in backup_data.get('budgets', []):
        category_id = category_name_to_id.get(budget_data.get('category_name'))
        
        budget, created = Budget.objects.update_or_create(
            user=user,
            name=budget_data.get('name', 'Budget'),
            defaults={
                'category_id': category_id,
                'amount': Decimal(budget_data.get('amount', '0')),
                'period': budget_data.get('period', 'MONTHLY'),
                'start_date': budget_data.get('start_date'),
                'end_date': budget_data.get('end_date'),
                'rollover': budget_data.get('rollover', False),
            }
        )
        if created:
            stats['budgets']['created'] += 1
        else:
            stats['budgets']['updated'] += 1
    
    # Import savings goals
    for goal_data in backup_data.get('savings_goals', []):
        goal, created = SavingsGoal.objects.update_or_create(
            user=user,
            name=goal_data['name'],
            defaults={
                'target_amount': Decimal(goal_data.get('target_amount', '0')),
                'current_amount': Decimal(goal_data.get('current_amount', '0')),
                'deadline': goal_data.get('deadline'),
                'description': goal_data.get('description', ''),
                'is_completed': goal_data.get('is_completed', False),
            }
        )
        if created:
            stats['savings_goals']['created'] += 1
        else:
            stats['savings_goals']['updated'] += 1
    
    # Import debts
    for debt_data in backup_data.get('debts', []):
        debt, created = Debt.objects.update_or_create(
            user=user,
            name=debt_data['name'],
            defaults={
                'debt_type': debt_data.get('debt_type', 'OTHER'),
                'principal': Decimal(debt_data.get('principal', '0')),
                'interest_rate': Decimal(debt_data.get('interest_rate', '0')),
                'minimum_payment': Decimal(debt_data.get('minimum_payment', '0')),
                'current_balance': Decimal(debt_data.get('current_balance', '0')),
                'due_date': debt_data.get('due_date'),
                'start_date': debt_data.get('start_date'),
                'notes': debt_data.get('notes', ''),
            }
        )
        if created:
            stats['debts']['created'] += 1
        else:
            stats['debts']['updated'] += 1
    
    # Import investments
    investment_name_to_id = {}
    for inv_data in backup_data.get('investments', []):
        investment, created = Investment.objects.update_or_create(
            user=user,
            name=inv_data['name'],
            defaults={
                'investment_type': inv_data.get('investment_type', 'STOCK'),
                'ticker_symbol': inv_data.get('ticker_symbol', ''),
                'quantity': Decimal(inv_data.get('quantity', '0')),
                'purchase_price': Decimal(inv_data.get('purchase_price', '0')),
                'current_price': Decimal(inv_data.get('current_price', '0')),
                'purchase_date': inv_data.get('purchase_date'),
                'notes': inv_data.get('notes', ''),
            }
        )
        investment_name_to_id[inv_data['name']] = investment.id
        if created:
            stats['investments']['created'] += 1
        else:
            stats['investments']['updated'] += 1
    
    # Import investment transactions
    for inv_txn_data in backup_data.get('investment_transactions', []):
        investment_id = investment_name_to_id.get(inv_txn_data.get('investment_name'))
        if not investment_id:
            stats['investment_transactions']['skipped'] += 1
            continue
        
        InvestmentTransaction.objects.create(
            investment_id=investment_id,
            transaction_type=inv_txn_data.get('transaction_type', 'BUY'),
            quantity=Decimal(inv_txn_data.get('quantity', '0')),
            price=Decimal(inv_txn_data.get('price', '0')),
            date=inv_txn_data.get('date'),
            notes=inv_txn_data.get('notes', ''),
        )
        stats['investment_transactions']['created'] += 1
    
    return Response({
        'message': 'Backup restored successfully',
        'stats': stats,
    })


# ============================================
# Session Management Views
# ============================================

def get_client_ip(request):
    """Extract client IP address from request"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0].strip()
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


def parse_user_agent(user_agent_string):
    """Parse user agent string to extract device info"""
    ua = user_agent_string.lower() if user_agent_string else ''
    
    # Device type
    if any(x in ua for x in ['mobile', 'android', 'iphone', 'ipad']):
        if 'ipad' in ua or 'tablet' in ua:
            device_type = 'tablet'
        else:
            device_type = 'mobile'
    else:
        device_type = 'desktop'
    
    # Browser
    if 'edg' in ua:
        browser = 'Microsoft Edge'
    elif 'chrome' in ua and 'safari' in ua:
        browser = 'Chrome'
    elif 'firefox' in ua:
        browser = 'Firefox'
    elif 'safari' in ua:
        browser = 'Safari'
    elif 'opera' in ua or 'opr' in ua:
        browser = 'Opera'
    else:
        browser = 'Unknown'
    
    # OS
    if 'windows' in ua:
        os_name = 'Windows'
    elif 'mac os' in ua or 'macos' in ua:
        os_name = 'macOS'
    elif 'linux' in ua:
        os_name = 'Linux'
    elif 'android' in ua:
        os_name = 'Android'
    elif 'iphone' in ua or 'ipad' in ua:
        os_name = 'iOS'
    else:
        os_name = 'Unknown'
    
    return {
        'device_type': device_type,
        'browser': browser,
        'os': os_name,
    }


def create_or_update_session(request, user):
    """Create or update a session record for the user"""
    from .models import UserSession, LoginHistory
    
    session_key = request.session.session_key
    if not session_key:
        request.session.create()
        session_key = request.session.session_key
    
    ip_address = get_client_ip(request)
    user_agent = request.META.get('HTTP_USER_AGENT', '')
    ua_info = parse_user_agent(user_agent)
    
    # Mark all other sessions as not current
    UserSession.objects.filter(user=user, is_current=True).update(is_current=False)
    
    # Create or update session
    session, created = UserSession.objects.update_or_create(
        session_key=session_key,
        defaults={
            'user': user,
            'ip_address': ip_address,
            'user_agent': user_agent,
            'device_type': ua_info['device_type'],
            'browser': ua_info['browser'],
            'os': ua_info['os'],
            'is_current': True,
        }
    )
    
    # Log the login
    LoginHistory.objects.create(
        user=user,
        ip_address=ip_address,
        user_agent=user_agent,
        device_type=ua_info['device_type'],
        browser=ua_info['browser'],
        os=ua_info['os'],
        success=True,
        login_method='password',
    )
    
    return session


def log_failed_login(request, user=None, reason='Invalid credentials'):
    """Log a failed login attempt"""
    from .models import LoginHistory
    
    ip_address = get_client_ip(request)
    user_agent = request.META.get('HTTP_USER_AGENT', '')
    ua_info = parse_user_agent(user_agent)
    
    LoginHistory.objects.create(
        user=user,
        ip_address=ip_address,
        user_agent=user_agent,
        device_type=ua_info['device_type'],
        browser=ua_info['browser'],
        os=ua_info['os'],
        success=False,
        failure_reason=reason,
        login_method='password',
    )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_sessions(request):
    """List all active sessions for the current user"""
    from .models import UserSession
    from .serializers import UserSessionSerializer
    
    # Clean up old sessions (older than 30 days)
    from django.utils import timezone
    from datetime import timedelta
    UserSession.objects.filter(
        user=request.user,
        last_activity__lt=timezone.now() - timedelta(days=30)
    ).delete()
    
    sessions = UserSession.objects.filter(user=request.user)
    serializer = UserSessionSerializer(sessions, many=True)
    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def revoke_session(request, session_id):
    """Revoke a specific session"""
    from .models import UserSession
    from django.contrib.sessions.models import Session
    
    try:
        session = UserSession.objects.get(id=session_id, user=request.user)
        
        # Delete Django session too
        try:
            Session.objects.filter(session_key=session.session_key).delete()
        except Exception:
            pass
        
        session.delete()
        return Response({'message': 'Session revoked successfully'})
    except UserSession.DoesNotExist:
        return Response({'error': 'Session not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def revoke_all_other_sessions(request):
    """Revoke all sessions except the current one"""
    from .models import UserSession
    from django.contrib.sessions.models import Session
    
    current_session_key = request.session.session_key
    other_sessions = UserSession.objects.filter(
        user=request.user
    ).exclude(session_key=current_session_key)
    
    # Delete Django sessions
    session_keys = list(other_sessions.values_list('session_key', flat=True))
    Session.objects.filter(session_key__in=session_keys).delete()
    
    # Delete our session records
    count = other_sessions.count()
    other_sessions.delete()
    
    return Response({
        'message': f'Revoked {count} other session(s)',
        'revoked_count': count,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def login_history(request):
    """Get login history for the current user"""
    from .models import LoginHistory
    from .serializers import LoginHistorySerializer
    
    # Get last 50 login attempts
    history = LoginHistory.objects.filter(user=request.user)[:50]
    serializer = LoginHistorySerializer(history, many=True)
    return Response(serializer.data)
