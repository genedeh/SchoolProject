from uuid import uuid4
from django.db import models
from user.models import User

# Create your models here.


class ClassRoom(models.Model):
    name = models.CharField(max_length=8, unique=True)
    assigned_Teacher = models.OneToOneField(User, on_delete=models.SET_NULL, null=True, related_name="classrooms")
    students = models.ForeignKey(User, on_delete=models.PROTECT, related_name='classes')

    def __str__(self) -> str:
        return self.name
    
class Subject(models.Model):
    name = models.CharField(max_length=100)
    assigned_class = models.ForeignKey(ClassRoom, related_name='sujects', on_delete=models.PROTECT)
    students_offering = models.ForeignKey(User, on_delete=models.PROTECT, related_name='subjects')


    def __str__(self) -> str:
        return f"{self.assigned_class.name}_{self.name}"
    
class Result(models.Model):
    TERM_CHOICES = [
        ('1st_term', '1ST TERM'),
        ('2nd_term', '2ND TERM'),
        ('3rd_term', '3RD TERM'),
    ]

    year_span = models.CharField(max_length=10, help_text="For Example: 2023/2024")
    assigned_class = models.OneToOneField(ClassRoom, on_delete=models.CASCADE, related_name='results')
    assigned_student = models.OneToOneField(User, on_delete=models.CASCADE, related_name='results')
    term = models.CharField(max_length=10, choices=TERM_CHOICES, default='1st_term')
    name = models.CharField(max_length=50, blank=True)
    result_file = models.FileField(blank=True, upload_to='results/')
    uploaded = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    uploaded_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.username:
            self.username = f"{self.year_span}_{self.term}_Result"
        super().save(*args, **kwargs)


class UploadList(models.Model):
    name = models.CharField(max_length=60, unique=True, blank=True)
    assigned_teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name='uploalists')
    results_to_be_uploaded = models.ManyToManyField(Result, related_name='uploalists')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.name