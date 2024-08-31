from urllib import response

from user.models import User
from .test_setup_academics_app import TestSetUp

class TestAcademicViews(TestSetUp):
    def test_invalid_user(self):
        response = self.client.post(self.offering_subjects_url,self.offering_subject_no_such_user_data, format="json")
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data['error'], "Invalid User.")

    def test_create_user(self):
        response = self.client.post(self.create_subject_url, self.subject_create_data, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['name'], 'SS2A_maths')
        self.assertEqual(response.data['assigned_teacher'], self.subject_assigned_teacher.pk)
        self.assertEqual(response.data['students_offering'], [self.subject_student.pk])

    def test_create_subject_with_an_already_know_name(self):
        self.client.post(self.create_subject_url, self.subject_create_data, format="json")
        response = self.client.post(self.create_subject_url, self.subject_create_data, format="json")
        self.assertEqual(response.data['detail'], "Failed to create subject.")
        self.assertEqual(response.status_code, 400)

    def test_create_subject_with_no_data(self):
        response = self.client.post(self.create_subject_url, {}, format="json")
        self.assertEqual(response.data['detail'], "Failed to create subject.")
        self.assertEqual(response.status_code, 400)
