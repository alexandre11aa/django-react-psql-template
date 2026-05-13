from rest_framework.routers import DefaultRouter

from auth.views import AuthViewSet


router_auth = DefaultRouter()

router_auth.register('auth', AuthViewSet, basename='auth')

urlpatterns = router_auth.urls
