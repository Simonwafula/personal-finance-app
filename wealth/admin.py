from django.contrib import admin
from .models import Asset, Liability, NetWorthSnapshot

admin.site.register(Asset)
admin.site.register(Liability)
admin.site.register(NetWorthSnapshot)
