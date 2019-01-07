from django.contrib import admin

from core.models import User, Property, PropertyImage, TenantDocument

admin.site.register(User)
admin.site.register(Property)
admin.site.register(PropertyImage)
admin.site.register(TenantDocument)

