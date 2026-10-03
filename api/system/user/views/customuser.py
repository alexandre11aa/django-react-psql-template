import logging

from rest_framework.views import APIView
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action, permission_classes

from common.views import DisableDefaultMethods, Pagination

from common.validations import auth_access_level

from auth.views import CookieJWTAuthentication

from user.models import CustomUser

from user.selectors.customuser import (
    customuser_get,
    customuser_get_any,
    customuser_list_all,
    customuser_search,
)

from user.services.customuser import (
    customuser_create,
    customuser_send_welcome_email,
    customuser_toggle_active,
    customuser_update,
)

from user.serializers.customuser import (
    CustomUserSerializer,
    CustomUserCreateWithIDSerializer,
    CustomUserUpdateByIDSerializer
)
 

class CustomUserViewSet(DisableDefaultMethods, viewsets.ModelViewSet):

    ## Operacional Methods para urls

    # Define o queryset padrão que será utilizado para todas as ações (exceção para ações customizadas)
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

    # Define lista de cargos habilitados nos endpoints
    auths = ["ADM"]

    def get_serializer_class(self):
        '''
        Método que seleciona o serializer correto dependendo da ação
        '''

        # Ação de criação
        if self.action == 'create':
            return CustomUserCreateWithIDSerializer
        # Ações de atualização
        if self.action == 'update_by_id':
            return CustomUserUpdateByIDSerializer
        # Ação padrão para outros casos
        return CustomUserSerializer

    def get_serializer_context(self):
        '''
        Contexto adicional do serializer (opcional)
        '''

        context = super().get_serializer_context()
        context['request'] = self.request  # Adiciona a requisição ao contexto
        return context

    ## Endpoints

    @action(detail=False, methods=['post'], url_path='create', authentication_classes=[CookieJWTAuthentication])
    @permission_classes([IsAuthenticated])
    def create_(self, request):
        '''
        Ação personalizada para criar

        Example:
            curl -X POST http://127.0.0.1:8000/api/v1/users/custom_user/create/ \
                -d "email=test_create@test.com" \
                -d "name=user_create" \
                -d "access_level=ADM" \
                -d "password=password123" \
                -b "access_token={TOKEN_DE_ACESSO}" \
                -H "Accept: application/json"
        '''

        # Realização de validações
        validations = [
            auth_access_level(request.user.access_level, self.auths),
        ]

        invalid_validations = [message for ok, message in validations if not ok and message]
        
        if invalid_validations:
            return Response({"detail": " ".join(invalid_validations)}, status=400)

        # Instancia o serializer para criação de objeto
        serializer = CustomUserCreateWithIDSerializer(data=request.data)

        if serializer.is_valid():
            user = customuser_create(serializer=serializer)  # Cria o objeto
            password = serializer.validated_data.get("password")
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  # Retorna erros se inválido
        
        logger = logging.getLogger(__name__)

        try:

            customuser_send_welcome_email(user=user, password=password)

            return Response({'id': user.id}, status=status.HTTP_201_CREATED)
        
        except Exception as e:

            logger.exception('Erro ao enviar email de criação de usuário.')

            return Response(
                {
                    "detail": "Usuário criado, porém ocorreu um erro ao processar envio de email.",
                    "error": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
         
    @action(detail=False, methods=['put', 'patch'], url_path='update_by_id/(?P<pk>[^/.]+)', authentication_classes=[CookieJWTAuthentication])
    @permission_classes([IsAuthenticated])
    def update_by_id(self, request, pk=None):
        '''
        Ação personalizada para atualizar

        Example:
            curl -X PUT http://127.0.0.1:8000/api/v1/users/custom_user/update_by_id/1/ \
                -d "email=test_update@dominio.com" \
                -d "name=user_update" \
                -d "access_level=ADM" \
                -d "password=password123" \
                -b "access_token={TOKEN_DE_ACESSO}" \
                -H "Accept: application/json"
        '''

        # Realização de validações
        validations = [
            auth_access_level(request.user.access_level, self.auths + ["USR"]),
        ]

        invalid_validations = [message for ok, message in validations if not ok and message]
        
        if invalid_validations:
            return Response({"detail": " ".join(invalid_validations)}, status=400)

        # Busca o objeto pelo código ou ID
        instance = customuser_get(pk=pk)

        serializer_class = CustomUserUpdateByIDSerializer

        # Instancia o serializer para validação e salvamento
        serializer = serializer_class(
            instance, data=request.data, partial=request.method == 'PATCH', context=self.get_serializer_context())
        serializer.is_valid(raise_exception=True)
        customuser_update(serializer=serializer)

        return Response(serializer.data, status=status.HTTP_200_OK if instance else status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['delete'], url_path='delete_by_id/(?P<pk>[^/.]+)', authentication_classes=[CookieJWTAuthentication])
    @permission_classes([IsAuthenticated])
    def delete_by_id(self, request, pk=None):
        '''
        Ação personalizada para excluir CustomUser por ID

        Example:
            curl -X DELETE http://127.0.0.1:8000/api/v1/users/custom_user/delete_by_id/2/ \
                -b "access_token={TOKEN_DE_ACESSO}" \
                -H "Accept: application/json"
        '''

        # Realização de validações
        validations = [
            auth_access_level(request.user.access_level, self.auths),
        ]

        invalid_validations = [message for ok, message in validations if not ok and message]
        
        if invalid_validations:
            return Response({"detail": " ".join(invalid_validations)}, status=400)

        # Busca o objeto por ID
        user = customuser_get_any(pk=pk)

        customuser_toggle_active(instance=user)

        return Response(status=status.HTTP_204_NO_CONTENT)  # Retorna resposta de sucesso
        
    @action(detail=False, methods=['get'], url_path='get_by_id/(?P<pk>[^/.]+)', authentication_classes=[CookieJWTAuthentication])
    @permission_classes([IsAuthenticated])
    def get_by_id(self, request, pk=None):
        '''
        Ação personalizada para recuperar CustomUser por ID

        Example:
            curl -X GET http://127.0.0.1:8000/api/v1/users/custom_user/get_by_id/3/ \
                -b "access_token={TOKEN_DE_ACESSO}" \
                -H "Accept: application/json"
        '''

        # Realização de validações
        validations = [
            auth_access_level(request.user.access_level, self.auths + ["USR"]),
        ]

        invalid_validations = [message for ok, message in validations if not ok and message]
        
        if invalid_validations:
            return Response({"detail": " ".join(invalid_validations)}, status=400)

        # Busca o objeto por ID ou código
        instance = customuser_get(pk=pk)
        serializer = self.get_serializer(instance)

        return Response(serializer.data)  # Retorna os dados do objeto encontrado
    
    @action(detail=False, methods=['get'], url_path='list_all', authentication_classes=[CookieJWTAuthentication])
    @permission_classes([IsAuthenticated])
    def list_all(self, request):
        '''
        Ação personalizada para listar todos os objetos

        Example:
            curl -X GET http://127.0.0.1:8000/api/v1/users/custom_user/list_all/ \
                -b "access_token={TOKEN_DE_ACESSO}" \
                -H "Accept: application/json"
        '''
        
        queryset = customuser_list_all(access_level=request.user.access_level, auths=self.auths)

        serializer = self.get_serializer(queryset, many=True)

        return Response(serializer.data)  # Retorna a lista de objetos filtrados

    @action(detail=False, methods=['get'], url_path='search', authentication_classes=[CookieJWTAuthentication])
    @permission_classes([IsAuthenticated])
    def search(self, request):
        '''
        Ação personalizada para buscar objetos com parâmetros específicos

        Example:
            curl -X GET "http://127.0.0.1:8000/api/v1/users/custom_user/search/?search_field=name&search_value=João&is_active=true&page=1" \
                -b "access_token={TOKEN_DE_ACESSO}" \
                -H "Accept: application/json"
        '''

        # Realização de validações
        validations = [
            auth_access_level(request.user.access_level, self.auths),
        ]

        invalid_validations = [message for ok, message in validations if not ok and message]
        
        if invalid_validations:
            return Response({"detail": " ".join(invalid_validations)}, status=400)

        queryset = customuser_search(query_params=request.query_params)

        paginator = Pagination()

        page = paginator.paginate_queryset(queryset, request, view=self)

        serializer = self.get_serializer(page, many=True)

        return paginator.get_paginated_response(serializer.data)
