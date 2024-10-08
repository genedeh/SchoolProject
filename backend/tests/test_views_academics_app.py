from django.urls import reverse
from .test_setup_academics_app import TestSetUp

class TestAcademicViews(TestSetUp):

# SUBJECT CREATE (POST) TEST 
    def test_create_subject(self):
        response = self.client.post(self.create_subject_url, self.subject_create_data, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['name'], self.subject_create_data['name'])
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
# SUBJECT RETRIEVE DATA (GET) TEST
    def test_404_subject_retrieve(self):
        response = self.client.get(self.subject_retrieve_url)
        self.assertEqual(response.data['detail'], "No Subject matches the given query.")
        self.assertEqual(response.status_code, 404)
    
    def test_200_subject_retrieve(self):
        subject = self.client.post(self.create_subject_url, self.subject_create_data, format="json")
        response = self.client.get(reverse("subjects", kwargs={'pk':subject.data['id']}))
        self.assertEqual(response.data['name'], self.subject_create_data['name'])
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
# SUBJECT DELETE TEST 
    def test_delete_subject(self):
        subject = self.client.post(self.create_subject_url, self.subject_create_data, format="json")
        response = self.client.delete(reverse("subjects", kwargs={'pk':subject.data['id']}))
        self.assertEqual(response.data['detail'], 'Subject deleted successfully.')
        self.assertEqual(response.status_code, 204)
    
    def test_failed_delete_subject(self):
        response = self.client.delete(self.subject_retrieve_url)
        self.assertEqual(response.data['detail'], 'Failed to delete subject.')
        self.assertEqual(response.status_code, 400)
# SUBJECT UPDATE TEST 
    def test_update_subject(self):
        subject = self.client.post(self.create_subject_url, self.subject_create_data, format="json")
        response = self.client.put(reverse("subjects", kwargs={'pk':subject.data['id']}),{"name":"SS3A_History"}, format="json")
        self.assertEqual(response.data['name'], "SS3A_History")
        self.assertEqual(response.status_code, 200)

    # CLASSROOM TESTS 
# ClASSROOM CREATE (POST) TEST 
    def test_create_classroom(self):
        response = self.client.post(self.create_classroom_url, self.classroom_create_data, format="json")
        # print(response.data, response.status_code, self.classroom_create_data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['name'], self.classroom_create_data['name'])
        self.assertEqual(response.data['assigned_teacher'], self.classroom_assigned_teacher.pk)
        self.assertEqual(response.data['students'], [self.classroom_student.pk])

    def test_create_classroom_with_an_already_know_name(self):
        self.client.post(self.create_classroom_url, self.classroom_create_data, format="json")
        response = self.client.post(self.create_classroom_url, self.classroom_create_data, format="json")
        self.assertEqual(response.data['detail'], "Failed to create classroom.")
        self.assertEqual(response.status_code, 400)

    def test_create_classroom_with_no_data(self):
        response = self.client.post(self.create_classroom_url, {}, format="json")
        self.assertEqual(response.data['detail'], "Failed to create classroom.")
        self.assertEqual(response.status_code, 400)
# SUBJECT RETRIEVE DATA (GET) TEST
    def test_404_classroom_retrieve(self):
        response = self.client.get(self.classroom_retrieve_url)
        self.assertEqual(response.status_code, 404)
    
    def test_200_classroom_retrieve(self):
        classroom = self.client.post(self.create_classroom_url, self.classroom_create_data, format="json")
        response = self.client.get(reverse("classrooms", kwargs={'pk':classroom.data['id']}))
        self.assertEqual(response.data['name'], self.classroom_create_data['name'])
        self.assertEqual(response.data['assigned_teacher']['username'], self.classroom_assigned_teacher.username)
        self.assertEqual(response.data['students'][0]['username'], self.classroom_student.username)
        self.assertEqual(response.status_code, 200)
    
    def test_get_classroom_name(self):
        self.client.post(self.create_classroom_url, self.classroom_create_data, format="json")
        response = self.client.get(self.classroom_name_retrieve)
        self.assertEqual(response.data[0]['name'],self.classroom_create_data['name'])
        self.assertEqual(response.status_code, 200)

    def test_get_classroom_name_does_not_exist(self):
        response = self.client.get(f"{reverse("classrooms")}?name={self.classroom_create_data['name']}")
        self.assertEqual(response.data.__len__(),0)
# SUBJECT DELETE TEST 
    def test_delete_classroom(self):
        classroom = self.client.post(self.create_classroom_url, self.classroom_create_data, format="json")
        response = self.client.delete(reverse("classrooms", kwargs={'pk':classroom.data['id']}))
        self.assertEqual(response.data['detail'], 'Classroom deleted successfully.')
        self.assertEqual(response.status_code, 204)
    
    def test_failed_delete_classroom(self):
        response = self.client.delete(self.classroom_retrieve_url)
        self.assertEqual(response.data['detail'], 'Failed to delete classroom.')
        self.assertEqual(response.status_code, 400)
# SUBJECT UPDATE TEST 
    def test_update_classroom(self):
        classroom = self.client.post(self.create_classroom_url, self.classroom_create_data, format="json")
        response = self.client.put(reverse("classrooms", kwargs={'pk':classroom.data['id']}),{"name":"SS3A"}, format="json")
        self.assertEqual(response.data['name'], "SS3A")
        self.assertEqual(response.status_code, 200)
    
    def test_update_classroom_with_incorrect_data(self):
        classroom = self.client.post(self.create_classroom_url, self.classroom_create_data, format="json")
        response = self.client.put(reverse("classrooms", kwargs={'pk':classroom.data['id']}),{"students":"josh"}, format="json")
        self.assertEqual(response.data['detail'], "Failed to update classroom.")
        self.assertEqual(response.status_code, 400)

