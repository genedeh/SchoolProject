import logging
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from collections import defaultdict
from . import serializers
from .models import ClassRoom, StudentResult, Subject
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination


class CustomPagination(PageNumberPagination):
    page_size = 2  # Default items per page
    page_size_query_param = 'page_size'  # Allow clients to override page size

    # max_page_size = 50  # Maximum allowed page size


# Configure logger
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


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


# ✅ Helper Function to Group Results by Session and Term


def group_results(results):
    grouped_data = defaultdict(lambda: {"session": "", "terms": []})

    for result in results:
        session = result.session
        term = result.term

        key = session  # Group by session

        # Initialize session
        grouped_data[key]["session"] = session

        # Check if term exists in that session
        term_entry = next(
            (t for t in grouped_data[key]["terms"] if t["term"] == term), None)

        if not term_entry:
            grouped_data[key]["terms"].append({
                "term": term,
                "results": []
            })

        # Add result under correct term
        for term_data in grouped_data[key]["terms"]:
            if term_data["term"] == term:
                term_data["results"].append(
                    serializers.StudentResultSerializer(result).data)

    return list(grouped_data.values())  # Convert defaultdict to list


# ✅ Django API View
class GetStudentResultView(generics.ListAPIView):
    serializer_class = serializers.StudentResultSerializer
    authentication_classes = [IsAuthenticated]
    pagination_class = CustomPagination

    def get_queryset(self):
        student_id = self.request.query_params.get("student_id", None)

        # ✅ Validate student_id
        if not student_id:
            return Response({"error": "student_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            student_id = int(student_id)  # Ensure it's a number
        except ValueError:
            return Response({"error": "Invalid student_id format. Must be an integer."}, status=status.HTTP_400_BAD_REQUEST)

        # ✅ Get Student Results
        results = StudentResult.objects.filter(assigned_student_id=student_id)
        if not results.exists():
            return Response({"error": "No results found for this student."}, status=status.HTTP_404_NOT_FOUND)

        return results

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        # ✅ If queryset is a Response (error case), return it
        if isinstance(queryset, Response):
            return queryset

        grouped_results = group_results(queryset)

        # ✅ Apply Pagination
        page = self.paginate_queryset(grouped_results)
        if page is not None:
            return self.get_paginated_response(page)

        return Response(grouped_results, status=status.HTTP_200_OK)
