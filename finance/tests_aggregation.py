import datetime
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

from .models import Account, Category, Transaction

User = get_user_model()


class TransactionAggregationTestCase(TestCase):
    """Test aggregation endpoints for transactions."""

    def setUp(self):
        """Create test user, accounts, categories, and transactions."""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.other_user = User.objects.create_user(
            username='otheruser',
            email='other@example.com',
            password='testpass123'
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

        # Create test account
        self.account = Account.objects.create(
            user=self.user,
            name="Test Account",
            account_type="SAVINGS",
            currency="USD",
            opening_balance=1000.00
        )

        # Create test categories
        self.income_cat = Category.objects.create(
            user=self.user,
            name="Salary",
            kind="INCOME"
        )
        self.expense_cat = Category.objects.create(
            user=self.user,
            name="Groceries",
            kind="EXPENSE"
        )

        # Create test transactions (various dates for aggregation)
        base_date = datetime.date(2024, 1, 1)
        self.transactions = [
            # Jan 1
            Transaction.objects.create(
                user=self.user,
                account=self.account,
                date=base_date,
                amount=5000.00,
                kind="INCOME",
                category=self.income_cat,
                description="Salary"
            ),
            Transaction.objects.create(
                user=self.user,
                account=self.account,
                date=base_date,
                amount=50.00,
                kind="EXPENSE",
                category=self.expense_cat,
                description="Groceries"
            ),
            # Jan 2
            Transaction.objects.create(
                user=self.user,
                account=self.account,
                date=base_date + datetime.timedelta(days=1),
                amount=100.00,
                kind="EXPENSE",
                category=self.expense_cat,
                description="More groceries"
            ),
            # Jan 8 (week later)
            Transaction.objects.create(
                user=self.user,
                account=self.account,
                date=base_date + datetime.timedelta(days=7),
                amount=3000.00,
                kind="INCOME",
                category=self.income_cat,
                description="Bonus"
            ),
            Transaction.objects.create(
                user=self.user,
                account=self.account,
                date=base_date + datetime.timedelta(days=7),
                amount=200.00,
                kind="EXPENSE",
                category=self.expense_cat,
                description="Utilities"
            ),
            # Feb 1 (different month)
            Transaction.objects.create(
                user=self.user,
                account=self.account,
                date=base_date + datetime.timedelta(days=31),
                amount=5000.00,
                kind="INCOME",
                category=self.income_cat,
                description="Salary"
            ),
            Transaction.objects.create(
                user=self.user,
                account=self.account,
                date=base_date + datetime.timedelta(days=31),
                amount=150.00,
                kind="EXPENSE",
                category=self.expense_cat,
                description="Groceries"
            ),
        ]

    def test_aggregated_by_day(self):
        """Test aggregated endpoint with day grouping."""
        response = self.client.get(
            '/api/finance/transactions/aggregated/',
            {'group_by': 'day', 'start': '2024-01-01', 'end': '2024-01-08'}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertIn('series', data)
        # Jan 1 & Jan 2 & Jan 8 = 3 days with activity
        self.assertGreater(len(data['series']), 0)
        # Check data structure
        for point in data['series']:
            self.assertIn('date', point)
            self.assertIn('income', point)
            self.assertIn('expenses', point)

    def test_aggregated_by_month(self):
        """Test aggregated endpoint with month grouping."""
        response = self.client.get(
            '/api/finance/transactions/aggregated/',
            {'group_by': 'month', 'start': '2024-01-01', 'end': '2024-02-01'}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertIn('series', data)
        # Should have Jan and Feb
        self.assertEqual(len(data['series']), 2)
        # Check Jan totals
        jan = next((p for p in data['series'] if '2024-01' in p['date']), None)
        self.assertIsNotNone(jan)
        self.assertEqual(jan['income'], 8000.00)  # 5000 + 3000
        self.assertEqual(jan['expenses'], 350.00)  # 50 + 100 + 200
        # Check Feb totals
        feb = next((p for p in data['series'] if '2024-02' in p['date']), None)
        self.assertIsNotNone(feb)
        self.assertEqual(feb['income'], 5000.00)
        self.assertEqual(feb['expenses'], 150.00)

    def test_aggregated_with_kind_filter(self):
        """Test aggregated endpoint with kind (INCOME/EXPENSE) filter."""
        response = self.client.get(
            '/api/finance/transactions/aggregated/',
            {
                'group_by': 'month',
                'start': '2024-01-01',
                'end': '2024-02-01',
                'kind': 'INCOME'
            }
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        for point in data['series']:
            self.assertEqual(point['expenses'], 0.00)

        response = self.client.get(
            '/api/finance/transactions/aggregated/',
            {
                'group_by': 'month',
                'start': '2024-01-01',
                'end': '2024-02-01',
                'kind': 'EXPENSE'
            }
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        for point in data['series']:
            self.assertEqual(point['income'], 0.00)

    def test_aggregated_with_last_n_days(self):
        """Test aggregated endpoint with last_n_days parameter."""
        # Create a recent transaction (today)
        today = datetime.date.today()
        Transaction.objects.create(
            user=self.user,
            account=self.account,
            date=today,
            amount=100.00,
            kind="INCOME",
            category=self.income_cat,
            description="Today income"
        )
        response = self.client.get(
            '/api/finance/transactions/aggregated/',
            {'group_by': 'day', 'last_n_days': '7'}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertIn('series', data)
        # Should include today's transaction
        self.assertGreater(len(data['series']), 0)

    def test_top_categories(self):
        """Test top_categories endpoint."""
        response = self.client.get(
            '/api/finance/transactions/top_categories/',
            {'start': '2024-01-01', 'end': '2024-02-01', 'limit': 5}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertIn('categories', data)
        self.assertEqual(len(data['categories']), 1)  # Only one expense category
        category = data['categories'][0]
        self.assertEqual(category['name'], 'Groceries')
        self.assertEqual(category['amount'], 500.00)  # 50 + 100 + 200 + 150

    def test_top_categories_limit(self):
        """Test top_categories endpoint respects limit parameter."""
        # Create multiple expense categories
        cat2 = Category.objects.create(
            user=self.user,
            name="Entertainment",
            kind="EXPENSE"
        )
        Transaction.objects.create(
            user=self.user,
            account=self.account,
            date=datetime.date(2024, 1, 3),
            amount=300.00,
            kind="EXPENSE",
            category=cat2,
            description="Movie"
        )
        response = self.client.get(
            '/api/finance/transactions/top_categories/',
            {'start': '2024-01-01', 'end': '2024-02-01', 'limit': 1}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(len(data['categories']), 1)
        # Groceries has 500, Entertainment has 300, so top 1 is Groceries
        self.assertEqual(data['categories'][0]['name'], 'Groceries')

    def test_user_isolation(self):
        """Test that users only see their own transactions in aggregation."""
        # Authenticate as other user
        self.client.force_authenticate(user=self.other_user)
        response = self.client.get(
            '/api/finance/transactions/aggregated/',
            {'group_by': 'month', 'start': '2024-01-01', 'end': '2024-02-01'}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        # Other user should see no transactions
        self.assertEqual(len(data['series']), 0)

    def test_unauthenticated_access(self):
        """Test that unauthenticated users cannot access aggregation."""
        self.client.force_authenticate(user=None)
        response = self.client.get(
            '/api/finance/transactions/aggregated/',
            {'group_by': 'day'}
        )
        # Both 401 and 403 indicate auth denial; accept either
        self.assertIn(
            response.status_code,
            [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN]
        )
