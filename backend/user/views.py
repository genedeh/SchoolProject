from rest_framework import generics
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from academics.models import ClassRoom
from . import serializers
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication


class LoginView(generics.GenericAPIView):
    serializer_class = serializers.UserLoginSerializer

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username,password=password)
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
            'username':user.username,
            'phone_number':user.phone_number,
            'birth_date':user.birth_date,
            'profile_picture': f'{user.profile_picture}',
            'email': user.email,
            'gender': user.gender,
            'is_student_or_teacher': user.is_student_or_teacher,
            'user_class': "",
            'is_admin':user.is_superuser,
            'teaching_subjects': [],
            'offering_subjects': []
        }

        if user_data['is_student_or_teacher']:
            dummy_value = list(user.classes.all().values_list('id', flat=True))
            if dummy_value:
              class_id = dummy_value[0]
              user_data.update({'user_class': ClassRoom.objects.get(id=int(class_id)).name})
            user_data.update({'offering_subjects':list(user.subjects.all().values_list('id', flat=True)) })

        else:
            try:
              user_data.update({'user_class': user.classrooms.name})
            except Exception as e:
                user_data.update({'user_class': None})
            user_data.update({'teaching_subjects':list(user.subject.all().values_list('id', flat=True)) })
            
        return Response(user_data, status=200)
    
class CreateAndSearchUserView(generics.ListCreateAPIView):
    serializer_class = serializers.UserListSerializer
    def get_queryset(self):
        username = self.request.query_params.get('username', None)
        if username is not None:
            return User.objects.filter(username__icontains=username)
        return User.objects.all()
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return serializers.UserListSerializer
        elif self.request.method == 'POST':
            return serializers.UserCreateSerializer
        
class QuickUserViewList(generics.ListAPIView):
    serializer_class = serializers.QuickUserViewSerializer
    def get_queryset(self):
        teacher = self.request.query_params.get('T', None)
        student = self.request.query_params.get('S', None)
        no_classroom = self.request.query_params.get('N', None)
        username = self.request.query_params.get('username', None)
        if teacher is not None:
            if no_classroom is not None:
                if username is not None:
                  return User.objects.filter(username__icontains=username, is_student_or_teacher=False, classrooms=None)
                return User.objects.filter(is_student_or_teacher=False, classrooms=None)
            else:
                if username is not None:
                  return User.objects.filter(username__icontains=username, is_student_or_teacher=False)
                return User.objects.filter(is_student_or_teacher=False)
        elif student is not None:
            if no_classroom is not None:
                if username is not None:
                  return User.objects.filter(username__icontains=username, is_student_or_teacher=True, classes=None)
                return User.objects.filter(is_student_or_teacher=True, classes=None)
            else:
                if username is not None:
                  return User.objects.filter(username__icontains=username, is_student_or_teacher=True)
                return User.objects.filter(is_student_or_teacher=True)
        return User.objects.all()

class UpdateAndDeleteUserView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = serializers.UserUpdateSerializer
    lookup_field = 'pk'

