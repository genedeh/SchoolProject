from rest_framework.test import APITestCase
from django.urls import reverse

class TestSetUp(APITestCase):
    def setUp(self):
        self.login_url = reverse("login")
        self.add_user_url = reverse('add-user')

        self.update_data = {
            "email": "updatedemail@example.com",
            "first_name": "UpdatedFirstName",
            "last_name": "UpdatedLastName"
        }
        self.update_user_url = "/api/update-user/1/"

        self.login_data = {
            'username': 'Tester_1',
            'password': '1234',
        }
        self.user_data = {
            "username": "Test_alpha",
            "password": "1234",
            "email": "testinemail@gmail.com",
            "first_name": "Test",
            "last_name": "alpha",
            "profile_picture": None,
            "is_student_or_teacher": False,
            "birth_date": None,
            "address": "test_adress",
            "is_superuser": False,
            "phone_number": "08129674178",
            "gender": "male",
            "classes": [],
            "classrooms": None,
            "subject": [],
            "subjects": [],
        }
        return super().setUp()
    
    def tearDown(self):
        return super().tearDown()