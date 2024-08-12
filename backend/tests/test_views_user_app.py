from .test_setup_user_app import TestSetUp
from user.models import User
from rest_framework import status
from django.urls import reverse


class TestUserViews(TestSetUp):

    # Login Api view Test
    def test_user_cannot_login_with_no_data(self):
        response = self.client.post(self.login_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data['error'], 'Invalid Credentials')
    
    def test_user_login_with_invalid_credentials(self):
        response = self.client.post(self.login_url,self.login_data,format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data['error'], 'Invalid Credentials')

    # Add User View Test
    def test_user_creation_success(self):
        response = self.client.post(self.add_user_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    
    def test_user_creation_duplicate_username(self):
        self.client.post(self.add_user_url, self.user_data, format='json')
        response = self.client.post(self.add_user_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', response.data)

    def test_user_creation_with_missing_data(self):

        incomplete_data = {
            'username': 'testuser2',
        }
        response = self.client.post(self.add_user_url, incomplete_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)
        self.assertIn('email', response.data)

    # Update User View Test
    def test_update_user(self):
        response = self.client.put(self.update_user_url, self.update_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.username, f"{self.update_data['first_name']}_{self.update_data['last_name']}")
        self.assertEqual(self.user.email, self.update_data['email'])
        self.assertEqual(self.user.first_name, self.update_data['first_name'])
        self.assertEqual(self.user.last_name, self.update_data['last_name'])
    
    # Delete User View Test
    def test_delete_nonexistent_user(self):
        nonexistent_user_url = reverse('delete-user', kwargs={'pk': 999})
        response = self.client.delete(nonexistent_user_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_delete_user_as_admin(self):
        response = self.client.delete(self.delete_user_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(User.objects.filter(pk=self.user_to_delete.pk).exists())