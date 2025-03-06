import logging
import re
from rest_framework.decorators import api_view
from .utils.student_result_utils import get_students_in_classroom, calculate_student_performance, rank_students, get_best_students_per_subject
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Max
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
            return Response({"detail": "subject_ids is required and cannot be empty."}, status=status.HTTP_400_BAD_REQUEST)

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

# ✅ Function to Validate Session Format (YYYY/YYYY)


def is_valid_session_format(session):
    return bool(re.match(r"^\d{4}/\d{4}$", session))

# ✅ Django API View


class StudentResultView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        student_id = request.GET.get("student_id")
        session_year = request.GET.get("session")
        classroom_id = request.GET.get("classroom_id")

        if not student_id:
            return Response({"detail": "student_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        if classroom_id:
            return self.get_results_by_classroom(student_id, classroom_id)

        if session_year:
            return self.get_results_by_session(student_id, session_year)

        return self.get_latest_session_results(student_id)

    def get_latest_session_results(self, student_id):
        latest_session = StudentResult.objects.filter(
            assigned_student_id=student_id).aggregate(Max("session"))["session__max"]

        if not latest_session:
            return Response({"detail": "No results found for this student."}, status=status.HTTP_404_NOT_FOUND)

        results = StudentResult.objects.filter(
            assigned_student_id=student_id, session=latest_session)
        return self.format_results(results, latest_session)

    def get_results_by_session(self, student_id, session_year):
        results = StudentResult.objects.filter(
            assigned_student_id=student_id, session=session_year)

        if not results.exists():
            return Response({"detail": "No results found for this session."}, status=status.HTTP_404_NOT_FOUND)

        return self.format_results(results, session_year)

    def get_results_by_classroom(self, student_id, classroom_id):
        results = StudentResult.objects.filter(
            assigned_student_id=student_id, classroom_id=classroom_id)

        if not results.exists():
            return Response({"detail": "No results found for this student in the given classroom."}, status=status.HTTP_404_NOT_FOUND)

        return self.format_results(results, results.first().session)

    def format_results(self, results, session_year):
        terms = {}
        available_sessions = StudentResult.objects.filter(assigned_student_id=results.first(
        ).assigned_student_id).values_list("session", flat=True).distinct()

        for result in results:
            term_name = result.term
            if term_name not in terms:
                terms[term_name] = []

            terms[term_name].append(
                serializers.StudentResultSerializer(result).data)

        return Response({
            "session": session_year,
            "terms": terms,
            "available_sessions": sorted(available_sessions, reverse=True),
        }, status=status.HTTP_200_OK)


# ✅ Student Result Creation API View
class CreateStudentResultView(generics.CreateAPIView):
    serializer_class = serializers.StudentCreateResultSerializer
    permissions_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        data = request.data

        # ✅ Validate Required Fields
        required_fields = ["assigned_student",
                           "session", "term", "scores", "comments"]
        missing_fields = [
            field for field in required_fields if field not in data]
        if missing_fields:
            return Response(
                {"error": f"Missing required fields: {', '.join(missing_fields)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        student_id = data["assigned_student"]
        session = data["session"]
        term = data["term"]
        scores = data["scores"]

        # ✅ Validate Session Format
        if not is_valid_session_format(session):
            return Response({"detail": "Invalid session format. Expected format: YYYY/YYYY"}, status=status.HTTP_400_BAD_REQUEST)

        # ✅ Ensure Term is Only "1st Term", "2nd Term", or "3rd Term"
        valid_terms = {"1st Term", "2nd Term", "3rd Term"}
        if term not in valid_terms:
            return Response({"detail": "Invalid term. Must be '1st Term', '2nd Term', or '3rd Term'"}, status=status.HTTP_400_BAD_REQUEST)

        # ✅ Prevent Duplicate Term Entries in a Session
        existing_result = StudentResult.objects.filter(
            assigned_student_id=student_id, session=session, term=term).exists()
        if existing_result:
            return Response({"detail": f"Result for {term} in session {session} already exists."}, status=status.HTTP_400_BAD_REQUEST)

        # ✅ Ensure All Scores are ≤ 100
        for subject, score_data in scores.items():
            exam_score = score_data.get("exam", 0)
            test_score = score_data.get("test", 0)
            if not (0 <= exam_score <= 60 and 0 <= test_score <= 40):
                return Response(
                    {"detail": f"Invalid scores for {subject}. Exam and test scores must be between 0 and 100."},
                    status=status.HTTP_400_BAD_REQUEST
                )


        # ✅ Create the Student Result Record
        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Student result created successfully!", "result": serializer.data}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UpdateStudentResultView(generics.RetrieveUpdateDestroyAPIView):
    queryset = StudentResult.objects.all()
    serializer_class = serializers.StudentUpdateResultSerializer
    lookup_field = 'pk'
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        # Retrieve the result or return 404
        result = self.get_object()

        data = request.data
        allowed_fields = {"uploaded", "scores", "comments",
                          "general_remarks", "term", "session"}
        # ✅ Validate session format (YYYY/YYYY)
        if not is_valid_session_format(data["session"]):
            return Response({"detail": "Invalid session format. Expected format: YYYY/YYYY"}, status=status.HTTP_400_BAD_REQUEST)

        # ✅ Validate term selection
        valid_terms = {"1st Term", "2nd Term", "3rd Term"}
        if "term" in data:
            term = data["term"]
            if term not in valid_terms:
                return Response({"detail": "Invalid term. Must be '1st Term', '2nd Term', or '3rd Term'."}, status=status.HTTP_400_BAD_REQUEST)

            # 🔄 Prevent duplicate term-session assignment
            if "session" in data:
                session = data["session"]
            else:
                session = result.session  # Use existing session if not provided in update request

            existing_result = StudentResult.objects.filter(
                assigned_student=result.assigned_student, session=session, term=term
            ).exclude(id=result.id).exists()

            if existing_result:
                return Response(
                    {"error": f"A result for {term} in session {session} already exists for this student."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # ✅ Validate scores (must be between 0 and 100)
        if "scores" in data:
            scores = data["scores"]
            if not isinstance(scores, dict):
                return Response({"error": "Scores must be a dictionary of subjects and their marks."}, status=status.HTTP_400_BAD_REQUEST)

            for subject, score_data in scores.items():
                exam_score = score_data.get("exam", 0)
                test_score = score_data.get("test", 0)
                if not (0 <= exam_score <= 60 and 0 <= test_score <= 40):
                    return Response(
                        {"detail": f"Invalid scores for {subject}. Exam and test scores must be between 0 and 100."},
                        status=status.HTTP_400_BAD_REQUEST
                    )

        # ✅ Apply the updates to the result instance
        for field in allowed_fields:
            if field in data:
                setattr(result, field, data[field])
        serializer = self.get_serializer(result, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()  # Save the updated result

        return Response({"message": "Student result updated successfully!", "result": serializer.data}, status=status.HTTP_200_OK)


class ClassroomPerformanceAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        logger.info("===== STARTING CLASSROOM PERFORMANCE API REQUEST =====")

        classroom_id = request.GET.get("classroom_id")

        if not classroom_id:
            logger.error("Missing classroom_id parameter")
            return Response({"detail": "Missing classroom_id parameter"}, status=status.HTTP_400_BAD_REQUEST)

        students = get_students_in_classroom(classroom_id)

        if students is None:
            logger.error("Classroom not found")
            return Response({"detail": "Classroom not found"}, status=status.HTTP_404_NOT_FOUND)

        students_performance = []

        for student in students:
            performance = calculate_student_performance(student, classroom_id)
            if performance:
                students_performance.append(performance)

        if not students_performance:
            logger.error("No student results found")
            return Response({"detail": "No student results found"}, status=status.HTTP_404_NOT_FOUND)

        ranked_students = rank_students(students_performance)
        best_per_subject = get_best_students_per_subject(students_performance)

        logger.info("===== END OF CLASSROOM PERFORMANCE API REQUEST =====")

        return Response({
            "students_performance": ranked_students,
            "best_per_subject": best_per_subject
        }, status=status.HTTP_200_OK)
