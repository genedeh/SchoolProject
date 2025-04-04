from dataclasses import fields
from .models import User
from academics.models import ClassRoom, Subject
from rest_framework import serializers


class ViewClassRoomNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassRoom
        fields = ['id', 'name']


class ViewSubjectNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'name']


class QuickUserViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'profile_picture_url', 'gender',
                  'is_student_or_teacher', 'classrooms', 'classes']


class UserLoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password')
        extra_kwargs = {'password': {'write_only': True}}


class UserCreateSerializer(serializers.ModelSerializer):
    # Ensure password is write-only
    password = serializers.CharField(write_only=True)
    classes = serializers.ListField(
        child=serializers.IntegerField(), write_only=True, required=False, allow_empty=True)
    subjects = serializers.ListField(
        child=serializers.IntegerField(), write_only=True, required=False, allow_empty=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'email',
                  'first_name', 'last_name', 'profile_picture',
                  'is_student_or_teacher', 'birth_date', 'address', 'is_superuser',
                  'phone_number', 'gender', 'classes',  'subjects', "admission_number",  "parent_guardian_name",
                  "parent_guardian_phone", "parent_guardian_email", "home_town",
                  "local_government_area", "nationality", "religion", "blood_group",
                  "genotype", "disability_status", "boarding_status", "nin", "state_of_origin"
                  ]

    def validate_username(self, value):
        # Check if the username already exists
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError(
                "A user with this username already exists.")
        return value

    def create(self, validated_data):
        classes = validated_data.pop("classes", [])
        subjects = validated_data.pop("subjects", [])

        print(validated_data, classes, subjects)
        user = User.objects.create(**validated_data)

        # Validate and set classes
        valid_classes = ClassRoom.objects.filter(id__in=classes)
        if len(valid_classes) != len(classes):
            raise serializers.ValidationError("Some class IDs are invalid.")

        # Validate and set subjects
        valid_subjects = Subject.objects.filter(id__in=subjects)
        if len(valid_subjects) != len(subjects):
            raise serializers.ValidationError("Some subject IDs are invalid.")

        user.classes.set(valid_classes)
        user.subjects.set(valid_subjects)
        user.set_password(validated_data['password'])
        user.save()

        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    username = serializers.CharField(read_only=True, required=False)

    class Meta:
        model = User
        fields = ['username', 'password', 'email',
                  'first_name', 'last_name', 'profile_picture',
                  'birth_date', 'address',
                  'phone_number', 'gender',"admission_number",  "parent_guardian_name",
                  "parent_guardian_phone", "parent_guardian_email", "home_town",
                  "local_government_area", "nationality", "religion", "blood_group",
                  "genotype", "disability_status", "boarding_status", "nin", "state_of_origin"
                  ]

    def update(self, instance, validated_data):
        instance.email = validated_data.get('email', instance.email)
        instance.first_name = validated_data.get(
            'first_name', instance.first_name)
        instance.last_name = validated_data.get(
            'last_name', instance.last_name)
        instance.username = validated_data.get(
            'username', f"{instance.first_name}_{instance.last_name}")
        instance.profile_picture = validated_data.get(
            'profile_picture', instance.profile_picture)
        instance.birth_date = validated_data.get(
            'birth_date', instance.birth_date)
        instance.address = validated_data.get('address', instance.address)
        instance.phone_number = validated_data.get(
            'phone_number', instance.phone_number)
        instance.gender = validated_data.get('gender', instance.gender)

        instance.admission_number = validated_data.get('admission_number', instance.admission_number)
        instance.parent_guardian_name = validated_data.get('parent_guardian_name', instance.parent_guardian_name)
        instance.parent_guardian_phone = validated_data.get('parent_guardian_phone', instance.parent_guardian_phone)
        instance.parent_guardian_email = validated_data.get('parent_guardian_email', instance.parent_guardian_email)
        instance.home_town = validated_data.get('home_town', instance.home_town)
        instance.local_government_area = validated_data.get('local_government_area', instance.local_government_area)
        instance.nationality = validated_data.get('nationality', instance.nationality)
        instance.religion = validated_data.get('religion', instance.religion)
        instance.blood_group = validated_data.get('blood_group', instance.blood_group)
        instance.genotype = validated_data.get('genotype', instance.genotype)
        instance.disability_status = validated_data.get('disability_status', instance.disability_status)
        instance.boarding_status = validated_data.get('boarding_status', instance.boarding_status)
        instance.nin = validated_data.get('nin', instance.nin)
        instance.state_of_origin = validated_data.get('state_of_origin', instance.state_of_origin)


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
        # fields = '__all__'
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile_picture_url', 'is_student_or_teacher',
                  'birth_date', 'address', 'is_superuser', 'phone_number', 'gender', 'classes',  'subjects', 'classrooms', 'subject']


class UserProfileSerializer(serializers.ModelSerializer):
    user_class = serializers.SerializerMethodField()
    profile_picture = serializers.SerializerMethodField()
    offering_subjects = serializers.SerializerMethodField()
    teaching_subjects = serializers.SerializerMethodField()
    teaching_subjects_id = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id", "first_name", "last_name", "address", "phone_number", "username",
            "profile_picture", "email", "birth_date", "gender", "is_student_or_teacher",
            "is_superuser", "user_class", "offering_subjects", "teaching_subjects", "teaching_subjects_id",
            "admission_number", "migrated_sessions", "parent_guardian_name",
            "parent_guardian_phone", "parent_guardian_email", "home_town",
            "local_government_area", "nationality", "religion", "blood_group",
            "genotype", "disability_status", "boarding_status", "previous_classes", "nin", "state_of_origin"
        ]

    def get_profile_picture(self, obj):
        return obj.profile_picture.url if obj.profile_picture else None

    def get_user_class(self, obj):
        """
        Returns the class for students and classrooms for teachers.
        """
        if obj.is_student_or_teacher:
            # Student's class
            try:
                class_ids = list(
                    obj.classes.all().values_list("id", flat=True))
                if class_ids:
                    classroom = ClassRoom.objects.get(id=class_ids[0])
                    return classroom.name
            except ClassRoom.DoesNotExist:
                return None
        # Teacher's classroom
        try:
            return obj.classrooms.name
        except User.classrooms.RelatedObjectDoesNotExist:
            return None
    def get_offering_subjects(self, obj):
        """
        Returns the subjects a student is offering.
        """
        if obj.is_student_or_teacher:
            # Use "name" instead of "id"
            return list(obj.subjects.all().values_list("name", flat=True))
        return None

    def get_teaching_subjects(self, obj):
        """
        Returns the subjects a teacher is teaching.
        """
        if not obj.is_student_or_teacher:  # If the user is a teacher
            # Use "name"
            return list(obj.subject.all().values_list("name", flat=True))
        return None

    def get_teaching_subjects_id(self, obj):
        """
        Returns the subjects a teacher is teaching.
        """
        if not obj.is_student_or_teacher:  # If the user is a teacher
            # Use "name"
            return list(obj.subject.all().values_list("id", flat=True))
        return None
