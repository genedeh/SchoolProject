from rest_framework.test import APITestCase
from user.models import User
from django.urls import reverse

class TestSetUp(APITestCase):
    def setUp(self):
        self.login_url = reverse("login")
        self.add_user_url = reverse('add-user')

        self.user = User.objects.create_user(
            username='test_user',
            email='testuser@example.com',
            password='testpassword',
            first_name='test',
            last_name='user'
        )
        self.update_user_url = reverse("update-user", kwargs={'pk': self.user.pk})
        self.user_to_delete = User.objects.create_user(
            username='test_beta',
            email='testuser@example.com',
            password='testpassword',
            first_name='test',
            last_name='beta'
        )
        self.delete_user_url = reverse("delete-user", kwargs={'pk': self.user_to_delete.pk})
        self.update_data = {
            "email": "updatedemail@example.com",
            "first_name": "UpdatedFirstName",
            "last_name": "UpdatedLastName",
            "classes":[],
            "subjects":[]
        }

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