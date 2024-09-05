from dataclasses import fields
from rest_framework import serializers

from user.models import User
from .models import ClassRoom, Subject

class ViewUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'gender', 'profile_picture']

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

class OfferingSubjectSerializer(serializers.ModelSerializer):
    students_offering = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(),many=True)
    class Meta:
        model = Subject
        fields = '__all__'
        extra_kwargs = {'name': {'read_only': True}, 'assigned_teacher': {'read_only': True}}

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