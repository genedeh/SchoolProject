from rest_framework.test import APITestCase
from django.urls import reverse

class TestSetUp(APITestCase):
    def setUp(self):
        self.login_url = reverse("login")

        self.login_data = {
            'username': 'Tester_1',
            'password': '1234',
        }
        return super().setUp()
    
    def tearDown(self):
        return super().tearDown()