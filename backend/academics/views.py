from rest_framework import generics, status
from rest_framework.response import Response
from .serializers import ClassRoomListSerializer, OfferingSubjectSerializer, SubjectsListSerializer, SubjectUpdateSerializer
from .models import ClassRoom, Subject
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
   queryset = Subject.objects.all()
  
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