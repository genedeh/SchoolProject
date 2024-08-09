from urllib import response

from user.models import User
from .test_setup_academics_app import TestSetUp

class TestAcademicViews(TestSetUp):
    def test_invalid_user(self):
        response = self.client.post(self.offering_subjects_url,self.offering_subject_no_such_user_data, format="json")
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data['error'], "Invalid User.")