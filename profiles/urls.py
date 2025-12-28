from django.urls import path
from . import views

app_name = 'profiles'

urlpatterns = [
    path('', views.profile_view, name='profile'),
    path('backup/export/', views.export_backup, name='export_backup'),
    path('backup/import/', views.import_backup, name='import_backup'),
    # Session management
    path('sessions/', views.list_sessions, name='list_sessions'),
    path('sessions/<int:session_id>/revoke/', views.revoke_session, name='revoke_session'),
    path('sessions/revoke-all-other/', views.revoke_all_other_sessions, name='revoke_all_other_sessions'),
    path('login-history/', views.login_history, name='login_history'),
]
