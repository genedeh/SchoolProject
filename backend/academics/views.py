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
        user = User.objects.get(id=id)
        if user is not None:
          if user.is_student_or_teacher:  
            subjects = Subject.objects.filter(students_offering=id)
            subject_list = []
            for subject in subjects:
               subject_list.append(subject)
            return Response({'Subjects': f"{subject_list}"}, status=200)
          else:
            return Response({'User-Type': f"{user.username} is a Teacher"}, status=200)
        else:
            return Response({'error': "User Not Found"}, status=404)