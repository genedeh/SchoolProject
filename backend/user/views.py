from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from .models import User
from .serializers import UserSerializer
# Create your views here.

class UserViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def list(self, request):
        queryset =  self.queryset
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)