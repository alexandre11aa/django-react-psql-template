from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import CustomUser, PasswordRecovery

@admin.register(CustomUser)
class CustomUserAdmin(BaseUserAdmin):
    
    # Campos exibidos na lista de usuários
    list_display = (
        'id', 'email', 'name', 'is_staff'
    )
    
    # Campos utilizados para pesquisa no painel administrativo
    search_fields = ('email',)
    
    # Filtros disponíveis para filtrar usuários na lista
    list_filter = ('is_staff', 'is_active')
    
    # Ordem de exibição dos usuários na lista
    ordering = ('name',)
    
    # Configurações para os formulários de edição e visualização
    fieldsets = (

        # Seção principal com campos básicos
        (None, {'fields': ('uuid', 'email', 'name', 'access_level', 'password')}),
        
        # Seção de permissões
        ('Permissions', {'fields': ('is_staff', 'is_active', 'is_superuser')}),
    )

    readonly_fields = ('uuid',)
    
    # Campos a serem exibidos ao adicionar um novo usuário
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'name', 'password1', 'password2', 'is_staff', 'is_superuser')
        }),
    )
    
    filter_horizontal = ()


@admin.register(PasswordRecovery)
class PasswordRecoveryAdmin(admin.ModelAdmin):
    list_display = ('user', 'token_hash', 'expires_at', 'used_at', 'invalidated_at')
    search_fields = ('user__email', 'user__name', 'token_hash')
    list_filter = ('expires_at', 'used_at', 'invalidated_at')

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if hasattr(self.model, "all_objects"):
            return self.model.all_objects.all()
        return qs