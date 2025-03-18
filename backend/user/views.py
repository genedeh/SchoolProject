from cloudinary.exceptions import Error as CloudinaryError
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

MAX_FILE_SIZE = 100 * 1024 * 1024  # 100MB

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
                return Response({'detail': 'Invalid Credentials'}, status=401)
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
        serializer = serializers.UserProfileSerializer(user)
        return Response(serializer.data, status=200)


class CreateAndSearchUserView(generics.ListCreateAPIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated]
    serializer_class = serializers.UserListSerializer

    def get_queryset(self):
        username = self.request.query_params.get('username', None)
        filters = {}

        if username:
            filters['username__icontains'] = username

        queryset = User.objects.filter(**filters)
        return queryset if queryset.exists() else []

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return serializers.UserListSerializer
        elif self.request.method == 'POST':
            return serializers.UserCreateSerializer

    def post(self, request, *args, **kwargs):
        try:
            # Get list values properly
            classes = request.POST.getlist("classes[]")
            subjects = request.POST.getlist("subjects[]")

            classes = [int(cls) for cls in classes if cls.isdigit()]
            subjects = [int(subj) for subj in subjects if subj.isdigit()]

            logger.info(f"Received classes: {classes}, subjects: {subjects}")

            user_data = request.data.copy()
            user_data.setlist("classes", classes)
            user_data.setlist("subjects", subjects)

            if "classes[]" in user_data:
                del user_data["classes[]"]
            if "subjects[]" in user_data:
                del user_data["subjects[]"]

            # Get profile picture
            profile_picture = request.FILES.get("profile_picture")

            if profile_picture:
                user_data["profile_picture"] = profile_picture

            serializer = self.get_serializer(data=user_data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except CloudinaryError as ce:
            logger.error(f"Cloudinary Error: {ce}")
            readable_size = round(
                # Convert to MB
                profile_picture.size / (1024 * 1024), 2)
            return Response({"detail": f"Invalid file type. Only images are allowed or File too large. Uploaded size: {readable_size}MB. Maximum allowed size is {MAX_FILE_SIZE / (1024 * 1024)}MB ."}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            logger.exception("Unexpected error occurred.")
            return Response(
                {"detail": f"An unexpected error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

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
                filters['classrooms'] = None  # Teachers without a classroom
        elif student is not None:
            # Assuming True means student
            filters['is_student_or_teacher'] = True
            if no_classroom is not None:
                filters['classes'] = None  # Students without a classroom

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
