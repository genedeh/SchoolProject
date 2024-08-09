from .test_setup_user_app import TestSetUp

class TestUserViews(TestSetUp):
    def test_user_cannot_login_with_no_data(self):
        response = self.client.post(self.login_url)

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['error'], 'Invalid Credentials')
    
    def test_user_login_with_invalid_credentials(self):
        response = self.client.post(self.login_url,self.login_data,format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['error'], 'Invalid Credentials')
