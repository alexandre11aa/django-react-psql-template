from user.choices import ACCESS_LEVEL_CHOICES
from user.models import CustomUser


def customuser_search(*, query_params):
    """
    Busca Usuários aplicando toggle de status, busca livre e ordenação,
    com paginação feita pela view.
    """

    queryset = CustomUser.all_objects.all()

    # Toggle de status (ativos/inativos/todos)
    is_active_param = query_params.get('is_active', None)

    if is_active_param is not None:
        queryset = queryset.filter(is_active=is_active_param.lower() == 'true')

    # Busca livre (combo "Filtro" + "Pesquisar")
    search_field = query_params.get('search_field', None)
    search_value = query_params.get('search_value', None)

    if search_field and search_value:

        if search_field == 'access_level':
            # access_level é um código (ADM/USR); busca pelo texto exibido ou pelo código
            matching_codes = [
                code for code, label in ACCESS_LEVEL_CHOICES
                if search_value.lower() in label.lower() or search_value.lower() in code.lower()
            ]
            queryset = queryset.filter(access_level__in=matching_codes)

        elif search_field in ('name', 'email'):
            queryset = queryset.filter(**{f"{search_field}__icontains": search_value})

    # Ordenação
    ordering_param = query_params.get('ordering', None)
    ordering_field = ordering_param.lstrip('-') if ordering_param else None

    if ordering_field in ('name', 'email', 'access_level', 'is_active'):
        queryset = queryset.order_by(ordering_param)
    else:
        queryset = queryset.order_by('name', 'id')

    return queryset
