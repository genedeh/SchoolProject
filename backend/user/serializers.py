from .models import User
from academics.models import ClassRoom, Subject
from academics.serializers import ClassRoomListSerializer, SubjectsListSerializer
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username','password')
        extra_kwargs = {'password': {'write_only': True}}

class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'profile_picture', 'is_student_or_teacher', 'birth_date', 'gender', 'classes', 'classrooms', 'address', 'phone_number', 'email')
        extra_kwargs = {'__all__': {'read_only': True}}

class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)  # Ensure password is write-only
    classes = serializers.PrimaryKeyRelatedField(queryset=ClassRoom.objects.all(),many=True)
    subjects = serializers.PrimaryKeyRelatedField(queryset=Subject.objects.all(), many=True)

    class Meta:
        model = User
        fields = ['username','password', 'email', 'first_name', 'last_name', 'profile_picture', 'is_student_or_teacher', 'birth_date', 'address','is_superuser', 'phone_number', 'gender', 'classes',  'subjects']

    def validate_username(self, value):
        # Check if the username already exists
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value

    def create(self, validated_data):
        classes_data = validated_data.pop('classes')
        subjects_data = validated_data.pop('subjects')

        user = User.objects.create(**validated_data)
        user.subjects.set(subjects_data)
        user.classes.set(classes_data)
        user.set_password(validated_data['password'])  # This handles password encryption
        user.save()
        return user
    
class UserUpdateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    username = serializers.CharField(read_only=True, required=False)
    classrooms = serializers.PrimaryKeyRelatedField(queryset=ClassRoom.objects.all(), required=False, allow_null=True)
    classes = serializers.PrimaryKeyRelatedField(queryset=ClassRoom.objects.all(), many=True, required=False)
    subject = serializers.PrimaryKeyRelatedField(queryset=Subject.objects.all(), many=True, required=False)
    subjects = serializers.PrimaryKeyRelatedField(queryset=Subject.objects.all(), many=True, required=False)

    class Meta:
        model = User
        fields = ['username','email', 'first_name', 'last_name', 'password', 'profile_picture',  'birth_date', 'address', 'phone_number', 'gender','classes','classrooms', 'subjects', 'subject']

    def update(self, instance, validated_data):
        instance.email = validated_data.get('email', instance.email)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.username = validated_data.get('username', f"{instance.first_name}_{instance.last_name}")
        
        # Handle password update
        password = validated_data.get('password', None)
        if password:
            instance.set_password(password)
        
        instance.save() 
        return instance
