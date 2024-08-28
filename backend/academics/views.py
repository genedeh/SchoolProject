from rest_framework import generics, status
from rest_framework.response import Response
from yaml import serialize
from .serializers import ClassRoomListSerializer, OfferingSubjectSerializer, SubjectsListSerializer, SubjectUpdateSerializer,SubjectCreateSerializer
from .models import ClassRoom, Subject
from rest_framework.decorators import api_view
from user.models import User
# Create your views here.

class ClassRoomRetrieveView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ClassRoomListSerializer
    queryset = ClassRoom.objects.all()
    lookup_field = 'pk'

class OfferingSubjectsListView(generics.GenericAPIView):
    serializer_class = OfferingSubjectSerializer
    def post(self, request):
        id = request.data.get('students_offering') 
        try:
          user = User.objects.get(id=id)
        except:
          return Response({'error': "Invalid User.", 'detail':f'No such User with id = {id}'}, status=404)
        if user is not None:
          if user.is_student_or_teacher:  
            subjects = Subject.objects.filter(students_offering=id)
            subject_list = []
            for subject in subjects:
               subject_list.append(subject.name)
            return Response({'Subjects':f"{subject_list}"}, status=200)
          else:
            subjects = Subject.objects.filter(assigned_teacher=id)
            subject_list = []
            for subject in subjects:
               subject_list.append(subject.name)
            return Response({'Subjects':f"{subject_list}"}, status=200)
          
class ClassRoomListView(generics.ListCreateAPIView):
   serializer_class = ClassRoomListSerializer
   queryset = ClassRoom.objects.all()

class SubjectsListView(generics.ListCreateAPIView):
   serializer_class = SubjectsListSerializer
   
   def get_queryset(self):
        name = self.request.query_params.get('name', None)
        if name is not None:
            return Subject.objects.filter(name=name)
        return Subject.objects.all()
   
   def get_serializer_class(self):
        if self.request.method == 'GET':
            return SubjectsListSerializer
        elif self.request.method == 'POST':
            return SubjectCreateSerializer

   def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class SubjectsRetrieveView(generics.RetrieveUpdateDestroyAPIView):
   serializer_class = SubjectUpdateSerializer
   queryset = Subject.objects.all()
   lookup_field = 'pk'

   def delete(self, request, *args, **kwargs):
        try:
            subject = self.get_object()
            subject.delete()
            return Response({"detail": "Subject deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({"detail": "Failed to delete subject."}, status=status.HTTP_400_BAD_REQUEST)