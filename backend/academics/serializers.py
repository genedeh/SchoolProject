from rest_framework import serializers
from .models import ClassRoom, Subject

class ClassRoomListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassRoom
        fields = ('id', 'name')
        extra_kwargs = {'__all__': {'read_only': True}}

class OfferingSubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'
        extra_kwargs = {'name': {'read_only': True}, 'assigned_teacher': {'read_only': True}}