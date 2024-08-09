from rest_framework import generics
from rest_framework.response import Response
from .serializers import ClassRoomListSerializer, OfferingSubjectSerializer
from .models import ClassRoom, Subject
from user.models import User
# Create your views here.

class ClassRoomRetrieveView(generics.RetrieveAPIView):
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