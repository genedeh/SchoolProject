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
    profile_picture = CloudinaryField('image', null=True, blank=True)
    is_student_or_teacher = models.BooleanField(default=False)
    birth_date = models.DateField(null=True)
    address = models.CharField(max_length=150, blank=True)
    email = models.EmailField()
    phone_number = models.CharField(max_length=11, blank=True)
    gender = models.CharField(
        max_length=20, choices=GENDER_CHOICES, default='male')
    # Stores sessions student was migrated
    migrated_sessions = models.JSONField(default=list,blank=True)
    nin = models.CharField(max_length=11, unique=True, null=True, blank=True)
    admission_number = models.CharField(
        max_length=20, unique=True, null=True, blank=True)
    parent_guardian_name = models.CharField(max_length=255, blank=True)
    parent_guardian_phone = models.CharField(max_length=15,blank=True)
    parent_guardian_email = models.EmailField(blank=True, null=True)
    home_town = models.CharField(max_length=255, blank=True, null=True)
    state_of_origin = models.CharField(max_length=100, blank=True, null=True)
    local_government_area = models.CharField(
        max_length=100, blank=True, null=True)
    nationality = models.CharField(max_length=50, default="Nigerian")
    religion = models.CharField(max_length=50, blank=True, null=True)

    blood_group = models.CharField(max_length=3, blank=True, null=True)
    genotype = models.CharField(max_length=2, blank=True, null=True)
    disability_status = models.TextField(blank=True, null=True)
    boarding_status = models.CharField(
        max_length=10, choices=[('Day', 'Day'), ('Boarding', 'Boarding')], default='Day')
    previous_classes = models.JSONField(default=list, blank=True)


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
