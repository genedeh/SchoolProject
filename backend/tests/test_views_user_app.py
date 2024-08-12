from .test_setup_user_app import TestSetUp
from user.models import User
from rest_framework import status


class TestUserViews(TestSetUp):
    def test_user_cannot_login_with_no_data(self):
        response = self.client.post(self.login_url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data['error'], 'Invalid Credentials')
    
    def test_user_login_with_invalid_credentials(self):
        response = self.client.post(self.login_url,self.login_data,format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data['error'], 'Invalid Credentials')

    def test_user_creation_success(self):
        response = self.client.post(self.add_user_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.get().username, 'Test_alpha')
        self.assertEqual(User.objects.get().first_name, 'Test')
        self.assertEqual(User.objects.get().last_name, 'alpha')
    
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

    def test_update_user(self):

        user = User.objects.create_user(
            username='test_user',
            email='testuser@example.com',
            password='testpassword',
            first_name='test',
            last_name='user'
        )

        response = self.client.put(self.update_user_url, self.update_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user.refresh_from_db()
        self.assertEqual(user.username, f"{self.update_data['first_name']}_{self.update_data['last_name']}")
        self.assertEqual(user.email, self.update_data['email'])
        self.assertEqual(user.first_name, self.update_data['first_name'])
        self.assertEqual(user.last_name, self.update_data['last_name'])
    