from rest_framework.test import APITestCase
from django.urls import reverse

from user.models import User

class TestSetUp(APITestCase):
    def setUp(self):
        self.offering_subjects_url = reverse("offering-subjects")

        self.offering_subject_no_such_user_data = {
            'students_offering': [1]
        }
        return super().setUp()
    
    def tearDown(self):
        return super().tearDown()