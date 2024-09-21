from rest_framework import generics, status
from rest_framework.response import Response
from .serializers import ClassRoomListSerializer, OfferingSubjectSerializer, SubjectsListSerializer, SubjectUpdateSerializer,SubjectCreateSerializer, ClassRoomCreateSerializer, ClassroomUpdateSerializer, ResultListSerializer
from .models import ClassRoom, Result, Subject
from user.models import User
# Create your views here.

class ClassRoomRetrieveView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ClassroomUpdateSerializer
    lookup_field = 'pk'

    def get_queryset(self):
      return ClassRoom.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return ClassRoomListSerializer
        elif self.request.method == 'PATCH' or self.request.method == 'PUT':
            return ClassroomUpdateSerializer

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
          serializer = self.get_serializer(classroom, data=request.data, partial=True)
          serializer.is_valid(raise_exception=True)
          self.perform_update(serializer)
          detail_serializer = ClassRoomListSerializer(classroom)
          return Response(detail_serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({"detail": "Failed to update classroom."}, status=status.HTTP_400_BAD_REQUEST)

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
   
   def get_queryset(self):
        name = self.request.query_params.get('name', None)
        if name is not None:
            return ClassRoom.objects.filter(name=name)
        return ClassRoom.objects.all()
   
   def get_serializer_class(self):
        if self.request.method == 'GET':
            return ClassRoomListSerializer
        elif self.request.method == 'POST':
            return ClassRoomCreateSerializer

   def create(self, request, *args, **kwargs):
        try:
          serializer = self.get_serializer(data=request.data)
          serializer.is_valid(raise_exception=True)
          serializer.save()
          print(serializer.data)
          headers = self.get_success_headers(serializer.data)
          return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except Exception as e:
          print(e)
          return Response({"detail": f"Failed to create classroom."}, status=status.HTTP_400_BAD_REQUEST)
   def perform_create(self, serializer):
        serializer.save()

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
        try:
          serializer = self.get_serializer(data=request.data)
          serializer.is_valid(raise_exception=True)
          self.perform_create(serializer)
          headers = self.get_success_headers(serializer.data)
          return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except Exception as e:
          return Response({"detail": f"Failed to create subject."}, status=status.HTTP_400_BAD_REQUEST)

class SubjectsRetrieveView(generics.RetrieveUpdateDestroyAPIView):
   serializer_class = SubjectUpdateSerializer
   lookup_field = 'pk'

   def get_queryset(self):
      return Subject.objects.all()

   def get_serializer_class(self):
        if self.request.method == 'GET':
            return SubjectsListSerializer
        elif self.request.method == 'PATCH' or self.request.method == 'PUT':
            return SubjectUpdateSerializer
      
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
          serializer = self.get_serializer(subject, data=request.data, partial=True)
          serializer.is_valid(raise_exception=True)
          self.perform_update(serializer)
          detail_serializer = SubjectsListSerializer(subject)
          return Response(detail_serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({"detail": "Failed to update subject."}, status=status.HTTP_400_BAD_REQUEST),

class ResultsListView(generics.ListCreateAPIView):
   serializer_class = ResultListSerializer
   
   def get_queryset(self):
      return Result.objects.all()
   
   def get_serializer_class(self):
        if self.request.method == 'GET':
            return ResultListSerializer
        elif self.request.method == 'POST':
            return ResultListSerializer
