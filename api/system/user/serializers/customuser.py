from rest_framework import serializers

from user.models import CustomUser
from user.choices import USER_FIELDS


# Serializer base para CustomUser
class CustomUserSerializer(serializers.ModelSerializer):
    """
    Serializer principal para manipulação geral dos campos do modelo CustomUser.
    """

    class Meta:
        model = CustomUser
        fields = USER_FIELDS[:6]

    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("Este email já está em uso.")
        return value


# Serializer para criação de CustomUser utilizando o ID
class CustomUserCreateWithIDSerializer(serializers.ModelSerializer):
    """
    Serializer para criação de CustomUser utilizando o ID.
    """
    
    class Meta:
        model = CustomUser
        fields = USER_FIELDS[:7]
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = CustomUser(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user


# Serializer para atualização de CustomUser usando o ID
class CustomUserUpdateByIDSerializer(serializers.ModelSerializer):
    """
    Serializer para atualização de CustomUser utilizando o ID.
    """
    
    class Meta:
        model = CustomUser
        fields = USER_FIELDS[:7]

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        
        # Atualiza os outros campos
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # Só altera a senha se ela não for None nem vazia
        if password not in (None, ''):
            instance.set_password(password)
        
        instance.save()
        return instance