from rest_framework import serializers


# Serializer "vazio" só para o Swagger/endpoint específico
class EmptySerializer(serializers.Serializer):
    """
    Serializer "vazio" apenas para o Swagger.
    Não mostra nenhum campo na UI.
    """
    _ = serializers.HiddenField(default=None)