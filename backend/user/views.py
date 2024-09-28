from rest_framework import generics
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from academics.models import ClassRoom
from .serializers import UserLoginSerializer, UserCreateSerializer, UserUpdateSerializer, UserListSerializer
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication


class LoginView(generics.GenericAPIView):
    serializer_class = UserLoginSerializer

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
            'user_class': None,
            'is_admin':user.is_superuser,
            'teaching_subjects': None
        }

        if user_data['is_student_or_teacher']:
            dummy_value = list(user.classes.all().values_list('id', flat=True))
            if dummy_value:
              class_id = dummy_value[0]
              user_data.update({'user_class': ClassRoom.objects.get(id=int(class_id)).name})
        else:
            try:
              user_data.update({'user_class': user.classrooms.name})
            except Exception as e:
                user_data.update({'user_class': None})
            user_data.update({'teaching_subjects':list(user.subject.all().values_list('id', flat=True)) })
            
        return Response(user_data, status=200)
    
class CreateAndSearchUserView(generics.ListCreateAPIView):
    serializer_class = UserListSerializer
    pagination_class = None
    def get_queryset(self):
        username = self.request.query_params.get('username', None)
        if username is not None:
            return User.objects.filter(username=username)
        return User.objects.all()
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return UserListSerializer
        elif self.request.method == 'POST':
            return UserCreateSerializer

class UpdateAndDeleteUserView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserUpdateSerializer
    lookup_field = 'pk'

