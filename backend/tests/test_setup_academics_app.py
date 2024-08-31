from rest_framework.test import APITestCase
from django.urls import reverse

from user.models import User

class TestSetUp(APITestCase):
    def setUp(self):
        self.offering_subjects_url = reverse("offering-subjects")
        self.create_subject_url = reverse("subjects")
        self.subject_retrieve_url = reverse("subjects", kwargs={'pk':"990"})

        self.subject_assigned_teacher = User.objects.create(username="Tester_1", first_name="Tester",last_name="1",is_student_or_teacher=False,password="1234")
        self.subject_student = User.objects.create(username="Tester_2", first_name="Tester",last_name="2",is_student_or_teacher=True,password="1234")
        self.offering_subject_no_such_user_data = {
            "students_offering": [1]
        }
        self.subject_create_data = {
            "name":"SS2A_maths",
            "assigned_teacher": self.subject_assigned_teacher.pk,
            "students_offering":[self.subject_student.pk]
        }
        return super().setUp()
    
    def tearDown(self):
        return super().tearDown()