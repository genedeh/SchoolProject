from django.db import models
from django.contrib.auth.models import AbstractUser
from uuid import uuid4
# Create your models here.

class User(AbstractUser, models.Model):
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=30)
    username = models.CharField(max_length=60,default=f"${last_name}_${first_name}", unique=True)
    user_id = models.UUIDField(default=f"#${uuid4()}", primary_key=True, unique=True)
    profile_picture = models.ImageField(upload_to='profile_images/', default='default_profile_images/default_image.jpeg')