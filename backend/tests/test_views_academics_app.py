from django.urls import reverse
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

    def test_404_subject_retrieve(self):
        response = self.client.get(self.subject_retrieve_url)
        self.assertEqual(response.data['detail'], "No Subject matches the given query.")
        self.assertEqual(response.status_code, 404)
    
    def test_200_subject_retrieve(self):
        subject = self.client.post(self.create_subject_url, self.subject_create_data, format="json")
        response = self.client.get(reverse("subjects", kwargs={'pk':subject.data['id']}))
        self.assertEqual(response.data['name'], 'SS2A_maths')
        self.assertEqual(response.data['assigned_teacher']['username'], self.subject_assigned_teacher.username)
        self.assertEqual(response.data['students_offering'][0]['username'], self.subject_student.username)
        self.assertEqual(response.status_code, 200)
    
    def test_get_subject_name(self):
        self.client.post(self.create_subject_url, self.subject_create_data, format="json")
        response = self.client.get(self.subject_name_retrieve)
        self.assertEqual(response.data[0]['name'],self.subject_create_data['name'])
        self.assertEqual(response.status_code, 200)

    def test_get_subject_name_does_not_exist(self):
        response = self.client.get(f"{reverse("subjects")}?name={self.subject_create_data['name']}")
        self.assertEqual(response.data.__len__(),0)
    
    def test_delete_subject(self):
        subject = self.client.post(self.create_subject_url, self.subject_create_data, format="json")
        response = self.client.delete(reverse("subjects", kwargs={'pk':subject.data['id']}))
        self.assertEqual(response.data['detail'], 'Subject deleted successfully.')
        self.assertEqual(response.status_code, 204)
    
    def test_delete_subject(self):
        response = self.client.delete(self.subject_retrieve_url)
        self.assertEqual(response.data['detail'], 'Failed to delete subject.')
        self.assertEqual(response.status_code, 400)

