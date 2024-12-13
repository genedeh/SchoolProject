from django.db import models
from django.contrib.auth.models import AbstractUser
from cloudinary.models import CloudinaryField
# Create your models here.

class User(AbstractUser, models.Model):

    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
    ]

    first_name = models.CharField(max_length=20, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    username = models.CharField(max_length=100, unique=True, blank=True)
    profile_picture = CloudinaryField('image',null=True, blank=True)
    is_student_or_teacher = models.BooleanField(default=False)
    birth_date = models.DateField(null=True)
    address = models.CharField(max_length=150, blank=True)
    email = models.EmailField()
    phone_number = models.CharField(max_length=11, blank=True)
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES, default='male')

    def profile_picture_url(self):
        if self.profile_picture:
            return self.profile_picture.url
        return None
     
    def __str__(self) -> str:
        return self.username
    
    def save(self, *args, **kwargs):
        if not self.username:
            self.username = f'{self.first_name}_{self.last_name}'
        super().save(*args, **kwargs)
