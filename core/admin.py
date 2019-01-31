from django.urls import reverse
from django.contrib import admin
from django.utils.safestring import mark_safe
from django.forms import ModelForm, PasswordInput
from core import models


class PropertyImageInline(admin.TabularInline):
    model = models.PropertyImage
    extra = 0
    classes = ["collapse"]


class PropertyAdmin(admin.ModelAdmin):
    inlines = [PropertyImageInline]
    list_display = (
        "name",
        "category",
        "property_value",
        "current_rental_value",
        "rental_revenue",
        "net_revenue",
        "year",
    )
    search_fields = ["category"]
    list_filter = ("category",)


class PropertyImageAdmin(admin.ModelAdmin):
    list_display = ("tag", "realty")
    search_fields = ["tag"]


class PaymentScheduleInline(admin.TabularInline):
    model = models.PaymentSchedule
    extra = 0
    classes = ["collapse"]


class LettingAdmin(admin.ModelAdmin):
    inlines = [PaymentScheduleInline]


class LettingInline(admin.TabularInline):
    model = models.Letting
    extra = 0
    classes = ["collapse"]
    readonly_fields = ("changeform_link",)

    def changeform_link(self, instance):
        if instance.id:
            # Replace "myapp" with the name of the app containing
            # your Certificate model:
            changeform_url = reverse("admin:core_letting_change", args=(instance.id,))
            return mark_safe(u'<a href="{u}">Details</a>'.format(u=changeform_url))
            # return u'<a href="%s" target="_blank">Details</a>' % changeform_url
        return u""

    changeform_link.allow_tags = True
    changeform_link.short_description = ""


class TenantDocumentInline(admin.TabularInline):
    model = models.TenantDocument
    ordering = ("name",)
    extra = 0
    classes = ["collapse"]


class TenantDocumentAdmin(admin.ModelAdmin):
    list_display = ("name", "date_created", "date_modified", "get_tenant_name")
    search_fields = ["name", "tenant__first_name", "tenant__last_name"]

    def get_tenant_name(self, obj):
        return " ".join([obj.tenant.first_name, obj.tenant.last_name])

    get_tenant_name.short_description = "Tenant Name"
    get_tenant_name.admin_order_field = "tenant"


class LettingAdmin(admin.ModelAdmin):
    inlines = [PaymentScheduleInline]
    list_display = (
        "get_tenant_name",
        "letting_type",
        "letting_duration",
        "letting_start_date",
        "letting_end_date",
    )
    search_fields = ["tenant__first_name", "tenant__last_name"]

    def get_tenant_name(self, obj):
        return " ".join([obj.tenant.first_name, obj.tenant.last_name])

    get_tenant_name.short_description = "Tenant Name"
    get_tenant_name.admin_order_field = "tenant"


class PaymentScheduleAdmin(admin.ModelAdmin):
    list_display = (
        "get_tenant_name",
        "amount_due",
        "payment_cycle",
        "tag",
        "active_schedule",
        "payment_status",
    )
    search_fields = ["letting__tenant__first_name", "letting__tenant__last_name"]
    list_filter = ("active_schedule", "tag", "payment_status")
    readonly_fields = ("amount_due", "tag", "payment_cycle")

    def get_tenant_name(self, obj):
        return " ".join([obj.letting.tenant.first_name, obj.letting.tenant.last_name])

    get_tenant_name.short_description = "Tenant Name"
    get_tenant_name.admin_order_field = "tenant"


class AdminUserForm(ModelForm):
    class Meta:
        model = models.User
        fields = ("first_name", "last_name", "email", "is_active", "is_superuser")


class UserAdmin(admin.ModelAdmin):
    inlines = [LettingInline, TenantDocumentInline]
    list_display = ("get_tenant_name", "email", "is_active")
    search_fields = ["first_name", "last_name", "email"]
    list_filter = ("is_active",)
    form = AdminUserForm

    def get_tenant_name(self, obj):
        return " ".join([obj.first_name, obj.last_name])

    get_tenant_name.short_description = "First Name/Last Name"


admin.site.register(models.User, UserAdmin)
admin.site.register(models.Property, PropertyAdmin)
admin.site.register(models.PropertyImage, PropertyImageAdmin)
admin.site.register(models.TenantDocument, TenantDocumentAdmin)
admin.site.register(models.Letting, LettingAdmin)
admin.site.register(models.PaymentSchedule, PaymentScheduleAdmin)
admin.site.register(models.PropertyDocument)
admin.site.register(models.PropertyRunningCosts)

admin.site.site_header = "Pyale Properties"
admin.site.site_title = "Pyale Properties"
admin.site.index_title = "Pyale Properties Administration Portal"
