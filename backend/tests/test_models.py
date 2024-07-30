from re import T
from django.test import TestCase
from user.models import User

class UserModelTest(TestCase):
    def test_create_student(self):
        user = User.objects.create_user(first_name="Test", last_name="1", email="Test@gmai.com",is_student_or_teacher=True, password='1234')
        self.assertEqual(user.username, 'Test_1')
        self.assertTrue(user.is_student_or_teacher)
    
    def test_create_teacher(self):
        user = User.objects.create_user(first_name="Test", last_name="2", email="Test@gmai.com",is_student_or_teacher=False, password='1234')
        self.assertEqual(user.username, 'Test_2')
        self.assertFalse(user.is_student_or_teacher)
    