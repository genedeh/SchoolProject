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
    classrooms = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False, allow_null=True)
    classes = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), many=True, required=False)
    subject = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), many=True, required=False)
    subjects = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), many=True, required=False)

    class Meta:
        model = User
        fields = ['username','password', 'email', 'first_name', 'last_name', 'profile_picture', 'is_student_or_teacher', 'birth_date', 'address','is_superuser', 'phone_number', 'gender', 'classes', 'classrooms', 'subject', 'subjects']

    def validate_username(self, value):
        # Check if the username already exists
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value

    def create(self, validated_data):
        user = User(
            email=validated_data['email'],
            username=validated_data['username'],
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
    
class UserUpdateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    username = serializers.CharField(read_only=True, required=False)
    classrooms = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False, allow_null=True)
    classes = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), many=True, required=False)
    subject = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), many=True, required=False)
    subjects = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), many=True, required=False)

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
