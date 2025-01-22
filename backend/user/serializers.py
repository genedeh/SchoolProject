from .models import User
from academics.models import ClassRoom, Subject
from rest_framework import serializers

class ViewClassRoomNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassRoom
        fields = ['id','name']

class ViewSubjectNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id','name']

class QuickUserViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username', 'profile_picture_url', 'gender', 'is_student_or_teacher','classrooms', 'classes']

class UserLoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username','password')
        extra_kwargs = {'password': {'write_only': True}}

class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)  # Ensure password is write-only
    classes = serializers.PrimaryKeyRelatedField(queryset=ClassRoom.objects.all(),many=True)
    subjects = serializers.PrimaryKeyRelatedField(queryset=Subject.objects.all(), many=True)

    class Meta:
        model = User
        fields = ['id','username','password', 'email', 'first_name', 'last_name', 'profile_picture', 'is_student_or_teacher', 'birth_date', 'address','is_superuser', 'phone_number', 'gender', 'classes',  'subjects']

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

    class Meta:
        model = User
        fields = ['username','password', 'email', 'first_name', 'last_name', 'profile_picture',  'birth_date', 'address', 'phone_number', 'gender']

    def update(self, instance, validated_data):
        instance.email = validated_data.get('email', instance.email)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.username = validated_data.get('username', f"{instance.first_name}_{instance.last_name}")
        instance.profile_picture = validated_data.get('profile_picture', instance.profile_picture)
        instance.birth_date = validated_data.get('birth_date', instance.birth_date)
        instance.address = validated_data.get('address', instance.address)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.gender = validated_data.get('gender', instance.gender)
        
        # Handle password update
        password = validated_data.get('password', None)
        if password:
            instance.set_password(password)
        instance.save() 
        return instance

class UserListSerializer(serializers.ModelSerializer):
    classrooms = ViewClassRoomNameSerializer()
    classes = ViewClassRoomNameSerializer(many=True)
    subjects = ViewSubjectNameSerializer(many=True)
    subject = ViewSubjectNameSerializer(many=True)
    class Meta:
        model = User
        fields = ['id','username', 'email', 'first_name', 'last_name', 'profile_picture_url', 'is_student_or_teacher', 'birth_date', 'address','is_superuser', 'phone_number', 'gender', 'classes',  'subjects', 'classrooms', 'subject']