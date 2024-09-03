from datetime import datetime
from django.db import models
from user.models import User

# Create your models here.


class ClassRoom(models.Model):
    name = models.CharField(max_length=8, unique=True)
    assigned_teacher = models.OneToOneField(User, on_delete=models.SET_NULL, null=True, related_name="classrooms")
    students = models.ManyToManyField(User, related_name='classes', blank=True)

    def __str__(self) -> str:
        return self.name
    
class Subject(models.Model):
    name = models.CharField(max_length=100)
    assigned_teacher = models.ForeignKey(User, related_name='subject', on_delete=models.PROTECT, null=True)
    students_offering = models.ManyToManyField(User,  related_name='subjects', blank=True)


    def __str__(self) -> str:
        return self.name
    
class Result(models.Model):
    TERM_CHOICES = [
        ('1st_term', '1ST TERM'),
        ('2nd_term', '2ND TERM'),
        ('3rd_term', '3RD TERM'),
    ]

    year_span = models.CharField(max_length=10, help_text="For Example: 2023/2024", blank=True)
    assigned_class = models.ForeignKey(ClassRoom, on_delete=models.CASCADE, related_name='results')
    assigned_student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='results')
    term = models.CharField(max_length=10, choices=TERM_CHOICES, default='1st_term')
    name = models.CharField(max_length=50, blank=True)
    result_file = models.FileField(blank=True, upload_to='results/')
    uploaded = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    uploaded_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.name
    
    def save(self, *args, **kwargs):
        self.year_span = f"{datetime.now().year}/{datetime.now().year + 1}"
        if not self.name:
            self.name = f"{self.assigned_student}_{self.year_span}_{self.term}_Result"
        super().save(*args, **kwargs)


class UploadList(models.Model):
    name = models.CharField(max_length=60, unique=True, blank=True)
    assigned_teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name='uploalists')
    assigned_class = models.ForeignKey(ClassRoom, on_delete=models.PROTECT, related_name="uploadlists", null=True)
    results_to_be_uploaded = models.ManyToManyField(Result, related_name='uploalists', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self) -> str:
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.name:
            self.name = f"{self.assigned_class}_{self.assigned_teacher}_UploadList"
        super().save(*args, **kwargs)