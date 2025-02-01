from rest_framework import generics, status
from django.contrib.auth import authenticate
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.exceptions import ValidationError
from .models import User
from rest_framework.parsers import MultiPartParser, FormParser
from academics.models import ClassRoom
from . import serializers
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
import logging

# Configure logger
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


class LoginView(generics.GenericAPIView):
    serializer_class = serializers.UserLoginSerializer

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user is None:
            try:
                user = User.objects.get(username=username, password=password)
            except:
                return Response({'error': 'Invalid Credentials'}, status=401)
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=200)


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        user = request.user
        user_data = {
            'id': user.id,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'address': user.address,
            'username': user.username,
            'phone_number': user.phone_number,
            'birth_date': user.birth_date,
            'profile_picture': None,
            'email': user.email,
            'gender': user.gender,
            'is_student_or_teacher': user.is_student_or_teacher,
            'user_class': "",
            'is_admin': user.is_superuser,
            'teaching_subjects': [],
            'offering_subjects': []
        }

        if user_data['is_student_or_teacher']:
            dummy_value = list(user.classes.all().values_list('id', flat=True))
            if dummy_value:
                class_id = dummy_value[0]
                user_data.update(
                    {'user_class': ClassRoom.objects.get(id=int(class_id)).name})
            user_data.update({'offering_subjects': list(
                user.subjects.all().values_list('id', flat=True))})

        else:
            try:
                user_data.update({'user_class': user.classrooms.name})
            except Exception as e:
                user_data.update({'user_class': None})
            user_data.update({'teaching_subjects': list(
                user.subject.all().values_list('id', flat=True))})
        if user.profile_picture:
            user_data.update({"profile_picture": user.profile_picture.url})
        return Response(user_data, status=200)


class CreateAndSearchUserView(generics.ListCreateAPIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated]
    serializer_class = serializers.UserListSerializer

    def get_queryset(self):
        username = self.request.query_params.get('username', None)
        # Initialize filters
        filters = {}

        if username:
            # Case-insensitive username search
            filters['username__icontains'] = username

        queryset = User.objects.filter(**filters)

        if not queryset.exists():
            return []

        return queryset

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return serializers.UserListSerializer
        elif self.request.method == 'POST':
            return serializers.UserCreateSerializer

    def post(self, request, *args, **kwargs):
        try:
            # Get list values properly
            # ✅ Correct way to get multiple values
            classes = request.POST.getlist("classes[]")
            subjects = request.POST.getlist("subjects[]")

            # Convert to integers if needed
            classes = [int(cls) for cls in classes if cls.isdigit()]
            subjects = [int(subj) for subj in subjects if subj.isdigit()]

            logger.info(f"Received classes: {classes}, subjects: {subjects}")

            # Include other request data in user creation

            user_data = request.data.copy()
            user_data.setlist("classes", classes)
            user_data.setlist("subjects", subjects)
            if "classes[]" in user_data:
                del user_data["classes[]"]
            if "subjects[]" in user_data:
                del user_data["subjects[]"]


            # ✅ Get profile picture
            profile_picture = request.FILES.get("profile_picture")
            if profile_picture:
                user_data["profile_picture"] = profile_picture

            serializer = self.get_serializer(data=user_data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class QuickUserViewList(generics.ListAPIView):
    serializer_class = serializers.QuickUserViewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Extract query parameters
        teacher = self.request.query_params.get('T', None)
        student = self.request.query_params.get('S', None)
        no_classroom = self.request.query_params.get('N', None)
        username = self.request.query_params.get('username', None)

        # Initialize filters
        filters = {}

        # Apply filters based on query params
        if teacher is not None:
            # Assuming True means teacher
            filters['is_student_or_teacher'] = False
            if no_classroom is not None:
                filters['classrooms'] = None  # Students without classrooms
        elif student is not None:
            # Assuming True means student
            filters['is_student_or_teacher'] = True
            if no_classroom is not None:
                filters['classes'] = None  # Teachers without classrooms

        if username:
            # Case-insensitive username search
            filters['username__icontains'] = username

        # Get queryset with applied filters
        print(filters)
        queryset = User.objects.filter(**filters)

        # Handle empty queryset scenario
        if not queryset.exists():
            error_message = self._generate_error_message(filters)
            raise NotFound(detail=error_message)

        return queryset

    def _generate_error_message(self, filters):
        """
        Helper function to generate appropriate error messages based on filters.
        """
        if filters.get('is_student_or_teacher') is True:
            if 'classes' in filters:
                return "No teachers found without a classroom."
            elif 'classrooms' in filters:
                return "No students found without a classroom."
            return "No users found matching the specified teacher/student filter."
        elif filters.get('is_student_or_teacher') is False:
            return "No users found who are not students or teachers."
        elif 'username__icontains' in filters:
            return f"No users found with username matching '{filters['username__icontains']}'."
        return "No users found with the given filters."


class UpdateAndDeleteUserView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = serializers.UserUpdateSerializer
    lookup_field = 'pk'
