from rest_framework import generics
from rest_framework.authentication import authenticate
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer

class LoginView(generics.GenericAPIView):
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        password = request.data.get('password')
        user = authenticate(request, first_name=first_name,last_name=last_name, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        else:
            return Response({'error': 'Invalid Credentials'}, status=400)


# class UserViewSet(viewsets.ViewSet):
#     # permission_classes = [permissions.AllowAny]
#     queryset = User.objects.all()
#     serializer_class = UserSerializer

#     def list(self, request):
#         queryset =  self.queryset
#         serializer = self.serializer_class(queryset, many=True)
#         return Response(serializer.data)