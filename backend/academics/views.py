from rest_framework import generics, status
from rest_framework.exceptions import NotFound
from rest_framework.views import APIView
from collections import defaultdict
from rest_framework.response import Response
from . import serializers
from .models import ClassRoom, Result, Subject
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
            raise NotFound(detail="No Such Classroom was found")

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
            raise NotFound(detail="No Such Subject was found")

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


class ResultsListView(generics.ListCreateAPIView):
    serializer_class = serializers.ResultListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Result.objects.select_related('classroom', 'assigned_student').order_by('classroom__name', 'year_span', 'assigned_student__username')

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return serializers.ResultListSerializer
        elif self.request.method == 'POST':
            return serializers.ResultCreateSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
        else:
            serializer = self.get_serializer(queryset, many=True)
        # Dictionary to hold class names as keys and lists of result objects as values
        results_by_class = defaultdict(
            lambda: defaultdict(lambda: defaultdict(list)))

        for result in serializer.data:
            year_span = result['year_span']
            assigned_student = result['assigned_student']['username']
            if result['classroom']:
                class_name = result['classroom']['name']
                results_by_class[class_name][year_span][assigned_student].append(
                    result)
            else:
                results_by_class["None"][year_span][assigned_student].append(
                    result)

        return Response(results_by_class, status=200)

    def create(self, request, *args, **kwargs):
        try:
            #   current_student_id = request.data['assigned_student']
            #   result_name = f'{User.objects.get(id=current_student_id).username}_{request.data['year_span']}_{request.data['term']}_Result'
            #   results_names = list(Result.objects.filter(assigned_student=current_student_id).values_list('name', flat=True))
            #   if result_name in results_names:
            #     return Response({"detail": f"Student cannot have the two equal terms in one year."}, status=status.HTTP_400_BAD_REQUEST)
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except Exception as e:
            return Response({"detail": f"Failed to create result."}, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        serializer.save()


class ResultRetrieveView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.ResultListSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'pk'

    def get_queryset(self):
        return Result.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return serializers.ResultListSerializer
        elif self.request.method == 'PATCH' or self.request.method == 'PUT':
            return serializers.ResultUpdateSerializer

    def delete(self, request, *args, **kwargs):
        try:
            result = self.get_object()
            result.delete()
            return Response({"detail": "Result deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({"detail": "Failed to delete result."}, status=status.HTTP_400_BAD_REQUEST)


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
