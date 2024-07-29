from django.db import models
from django.contrib.auth.models import AbstractUser
from uuid import uuid4

# Create your models here.

class User(AbstractUser, models.Model):
    first_name = models.CharField(max_length=20, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    username = models.CharField(max_length=100, unique=True, blank=True)
    user_id = models.UUIDField(default=f"{uuid4()}", primary_key=True, unique=True)
    profile_picture = models.ImageField(upload_to='profile_images/', default='default_profile_images/default_image.jpeg')
    is_student_or_teacher = models.BooleanField(default=False)
    age = models.IntegerField(default=13)
    address = models.CharField(max_length=150, blank=True)
    email = models.EmailField()
    phone_number = models.CharField(max_length=11, blank=True)

    def __str__(self) -> str:
        return self.username
    
    def save(self, *args, **kwargs):
        if not self.username:
            self.username = f'{self.first_name}_{self.last_name}'
        super().save(*args, **kwargs)
