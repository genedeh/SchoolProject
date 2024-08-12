from rest_framework import serializers

from user.models import User
from .models import ClassRoom, Subject

class ClassRoomListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassRoom
        fields = '__all__'
        extra_kwargs = {'__all__': {'read_only': True}} 

class OfferingSubjectSerializer(serializers.ModelSerializer):
    students_offering = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(),many=True)
    class Meta:
        model = Subject
        fields = '__all__'
        extra_kwargs = {'name': {'read_only': True}, 'assigned_teacher': {'read_only': True}}

class SubjectsListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'
        extra_kwargs = {'__all__': {'read_only': True}}

