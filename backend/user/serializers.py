from .models import User
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username','first_name','last_name', 'password')
        extra_kwargs = {'password': {'write_only': True}}

class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'profile_picture', 'is_student_or_teacher', 'birth_date', 'gender', 'classes', 'classrooms', 'address', 'phone_number', 'email')
        extra_kwargs = {'__all__': {'read_only': True}}