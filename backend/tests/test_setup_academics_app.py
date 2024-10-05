import random
from rest_framework.test import APITestCase
from django.urls import reverse

from user.models import User

class TestSetUp(APITestCase):
    def setUp(self):
        # Subject urls
        self.create_subject_url = reverse("subjects")
        self.subject_retrieve_url = reverse("subjects", kwargs={'pk':"990"})
        # Classroom urls
        self.create_classroom_url = reverse("classrooms")
        self.classroom_retrieve_url = reverse("classrooms", kwargs={'pk':"990"})
        # Subject Teacher and Student
        self.subject_assigned_teacher = User.objects.create(username="Tester_1", first_name="Tester",last_name="1",is_student_or_teacher=False,password="1234")
        self.subject_student = User.objects.create(username="Tester_2", first_name="Tester",last_name="2",is_student_or_teacher=True,password="1234")
        # Classroom Teacher and student 
        self.classroom_assigned_teacher = User.objects.create(username="Tester_3", first_name="Tester",last_name="3",is_student_or_teacher=False,password="1234")
        self.classroom_student = User.objects.create(username="Tester_4", first_name="Tester",last_name="4",is_student_or_teacher=True,password="1234")
        # Subject Test Data 
        self.offering_subject_no_such_user_data = {
            "students_offering": [1]
        }
        self.subject_create_data = {
            "name":f"SS2A_maths{random.randint(1,10)}",
            "assigned_teacher": self.subject_assigned_teacher.pk,
            "students_offering":[self.subject_student.pk]
        }
        # Subject Retrieve Url 
        self.subject_name_retrieve = f"{reverse("subjects")}?name={self.subject_create_data['name']}"
        # Classroom Test Data
        self.classroom_create_data = {
            "name":f"SS2A{random.randint(1,10)}",
            "assigned_teacher": self.classroom_assigned_teacher.pk,
            "students":[self.classroom_student.pk]
        }
        # Classroom Retrieve Url 
        self.classroom_name_retrieve = f"{reverse("classrooms")}?name={self.classroom_create_data['name']}"

        return super().setUp()
    
    def tearDown(self):
        return super().tearDown()