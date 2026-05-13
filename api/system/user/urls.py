from user.views.customuser import CustomUserViewSet
from rest_framework.routers import DefaultRouter

router_user = DefaultRouter()

# Registrando o CustomUserViewSet no roteador
router_user.register('custom_user', CustomUserViewSet)

urlpatterns = router_user.urls