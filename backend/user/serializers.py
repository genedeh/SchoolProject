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

class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)  # Ensure password is write-only

    class Meta:
        model = User
        fields = ['password', 'email', 'first_name', 'last_name', 'profile_picture', 'is_student_or_teacher', 'birth_date', 'address','is_superuser', 'phone_number', 'gender', 'classes', 'classrooms', 'subject', 'subjects']

    def create(self, validated_data):
        user = User(
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            profile_picture=validated_data['profile_picture'],
            is_student_or_teacher=validated_data['is_student_or_teacher'],
            birth_date=validated_data['birth_date'],
            address=validated_data['address'],
            is_superuser=validated_data['is_superuser'],
            phone_number=validated_data['phone_number'],
            gender=validated_data['gender']
        )
        user.set_password(validated_data['password'])  # This handles password encryption
        user.save()
        return user