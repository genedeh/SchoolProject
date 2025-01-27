from rest_framework import generics, status
from rest_framework.exceptions import NotFound
from rest_framework.views import APIView
from rest_framework.response import Response
from . import serializers
from .models import ClassRoom, StudentResult, Subject
from rest_framework.permissions import IsAuthenticated

# Create your views here.


class ClassRoomRetrieveView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.ClassroomUpdateSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'pk'

    def get_queryset(self):
        return ClassRoom.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return serializers.ClassRoomListSerializer
        elif self.request.method == 'PATCH' or self.request.method == 'PUT':
            return serializers.ClassroomUpdateSerializer

    def delete(self, request, *args, **kwargs):
        try:
            classroom = self.get_object()
            classroom.delete()
            return Response({"detail": "Classroom deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({"detail": "Failed to delete classroom."}, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        try:
            classroom = self.get_object()
            serializer = self.get_serializer(
                classroom, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            detail_serializer = serializers.ClassRoomListSerializer(classroom)
            return Response(detail_serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({"detail": "Failed to update classroom."}, status=status.HTTP_400_BAD_REQUEST)


class ClassRoomListView(generics.ListCreateAPIView):
    serializer_class = serializers.ClassRoomListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        name = self.request.query_params.get('name', None)
        filters = {}
        if name:
            filters["name__icontains"] = name

        queryset = ClassRoom.objects.filter(**filters)
        if not queryset.exists():
            return []

        return queryset

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return serializers.ClassRoomListSerializer
        elif self.request.method == 'POST':
            return serializers.ClassRoomCreateSerializer

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except Exception as e:
            print(e)
            return Response({"detail": f"Failed to create classroom."}, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        serializer.save()


class SubjectsListView(generics.ListCreateAPIView):
    serializer_class = serializers.SubjectsListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        name = self.request.query_params.get('name', None)
        filters = {}
        if name:
            filters["name__icontains"] = name

        queryset = Subject.objects.filter(**filters)
        if not queryset.exists():
            return []

        return queryset

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return serializers.SubjectsListSerializer
        elif self.request.method == 'POST':
            return serializers.SubjectCreateSerializer

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except Exception as e:
            return Response({"detail": f"Failed to create subject."}, status=status.HTTP_400_BAD_REQUEST)


class SubjectsRetrieveView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.SubjectUpdateSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'pk'

    def get_queryset(self):
        return Subject.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return serializers.SubjectsListSerializer
        elif self.request.method == 'PATCH' or self.request.method == 'PUT':
            return serializers.SubjectUpdateSerializer

    def delete(self, request, *args, **kwargs):
        try:
            subject = self.get_object()
            subject.delete()
            return Response({"detail": "Subject deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({"detail": "Failed to delete subject."}, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        try:
            subject = self.get_object()
            serializer = self.get_serializer(
                subject, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            detail_serializer = serializers.SubjectsListSerializer(subject)
            return Response(detail_serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({"detail": "Failed to update subject."}, status=status.HTTP_400_BAD_REQUEST),


class GetSubjectsById(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        # Get the list of subject IDs from the request data
        subject_ids = request.data.get('subject_ids', [])

        # Ensure the list is provided and not empty
        if not subject_ids:
            return Response({"error": "subject_ids is required and cannot be empty."}, status=status.HTTP_400_BAD_REQUEST)

        # Find subjects matching the provided IDs
        subjects = Subject.objects.filter(id__in=subject_ids)

        # If no subjects were found, return an appropriate message
        if not subjects.exists():
            return Response({"message": "No subjects found for the provided IDs."}, status=status.HTTP_404_NOT_FOUND)

        # Serialize the subjects and return them in the response
        serializer = serializers.SubjectsListSerializer(subjects, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


