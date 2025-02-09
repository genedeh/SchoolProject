from rest_framework import serializers

from user.models import User
from .models import ClassRoom, StudentResult, Subject

class ViewUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'gender', 'profile_picture', 'classes']
        
class ViewClassroomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassRoom
        fields = ['id', 'name']

class ClassRoomListSerializer(serializers.ModelSerializer):
    assigned_teacher = ViewUserSerializer()
    students = ViewUserSerializer(many=True)
    class Meta:
        model = ClassRoom
        fields = '__all__'
        extra_kwargs = {'__all__': {'read_only': True}} 

class ClassRoomCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassRoom
        fields = '__all__'

    def validate_name(self, value):
        if ClassRoom.objects.filter(name=value).exists():
            raise serializers.ValidationError("Classroom with this name already exists.")
        return value

class ClassroomUpdateSerializer(serializers.ModelSerializer):
    students = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), many=True, required=False)
    assigned_teacher = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False, allow_null=True)

    class Meta:
        model = ClassRoom
        fields = '__all__'

    def update(self, instance, validated_data):
        # Update the name if provided
        instance.name = validated_data.get('name', instance.name)
        
        # Update the teacher if provided (can also be null to remove the teacher)
        instance.assigned_teacher = validated_data.get('assigned_teacher', instance.assigned_teacher)
        
        # Update students if provided
        if 'students' in validated_data:
            students = validated_data['students']
            instance.students.set(students)
        
        instance.save()
        return instance

class SubjectsListSerializer(serializers.ModelSerializer):
    assigned_teacher = ViewUserSerializer()
    students_offering = ViewUserSerializer(many=True)
    class Meta:
        model = Subject
        fields = '__all__'
        extra_kwargs = {'__all__': {'read_only': True}}

class SubjectCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'

    def validate_name(self, value):
        if Subject.objects.filter(name=value).exists():
            raise serializers.ValidationError("Subject with this name already exists.")
        return value

class SubjectUpdateSerializer(serializers.ModelSerializer):
    students_offering = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), many=True, required=False)
    assigned_teacher = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False, allow_null=True)

    class Meta:
        model = Subject
        fields = '__all__'

    def update(self, instance, validated_data):
        # Update the name if provided
        instance.name = validated_data.get('name', instance.name)
        
        # Update the teacher if provided (can also be null to remove the teacher)
        instance.assigned_teacher = validated_data.get('assigned_teacher', instance.assigned_teacher)
        
        # Update students if provided
        if 'students_offering' in validated_data:
            students_offering = validated_data['students_offering']
            instance.students_offering.set(students_offering)
        
        instance.save()
        return instance
    

class StudentResultSerializer(serializers.ModelSerializer):
    assigned_student = serializers.SerializerMethodField()
    classroom = ViewClassroomSerializer()

    class Meta:
        model = StudentResult
        fields = "__all__"

    def get_assigned_student(self, obj):
        if obj.assigned_student:
            return {
                "id": obj.assigned_student.id,
                "username": obj.assigned_student.username,
                "gender": obj.assigned_student.gender,
                "profile_picture": obj.assigned_student.profile_picture.url if obj.assigned_student.profile_picture else None,
            }
        return None


class StudentCreateResultSerializer(serializers.ModelSerializer):
    scores = serializers.JSONField()  # Ensures scores are JSON
    comments = serializers.JSONField()  # Handles comments as JSON
    general_remarks = serializers.JSONField()  # Handles additional remarks
    class Meta:
        model = StudentResult
        fields = "__all__"

    
