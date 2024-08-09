from rest_framework import generics
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User
from academics.models import ClassRoom
from .serializers import UserSerializer, UserListSerializer
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication


class LoginView(generics.GenericAPIView):
    serializer_class = UserSerializer

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
        }
        if user_data['is_student_or_teacher']:
            dummy_value = str(user.classes.all().values_list('id', flat=True))
            dummy_array1 = dummy_value.split()
            dummy_array2 = dummy_array1[1].split(']')
            class_id = int(dummy_array2[0].split('[')[1])
            user_data.update({'user_class': ClassRoom.objects.get(id=class_id).name})
        else:
            print('Teacher: ',user.classrooms.name)
            user_data.update({'user_class': user.classrooms.name})
            
        return Response(user_data, status=200)
    
class UserSearchView(generics.ListAPIView):
    serializer_class = UserListSerializer
    queryset = User.objects.all()