from django.db import models
from user.models import User

# Create your models here.


class ClassRoom(models.Model):
    name = models.CharField(max_length=8, unique=True)
    no_of_students = models.IntegerField(verbose_name="Number Of Students")
    assigned_Teacher = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    def __str__(self) -> str:
        return self.name
    
class Subject(models.Model):
    name = models.CharField(max_length=100)
    assigned_class = models.ForeignKey(ClassRoom, on_delete=models.SET_NULL, null=True)

    def __str__(self) -> str:
        return f"${self.assigned_class.name}_${self.name}"
    
class Result(models.Model):
    TERM_CHOICES = [
        ('1st_term', '1ST TERM'),
        ('2nd_term', '2ND TERM'),
        ('3rd_term', '3RD TERM'),
    ]

    year_span = models.CharField(max_length=10, help_text="For Example: 2023/2024")
    assigned_class = models.ForeignKey(ClassRoom, on_delete=models.CASCADE)
    assigned_student = models.ForeignKey(User, on_delete=models.CASCADE)
    term = models.CharField(max_length=10, choices=TERM_CHOICES, default='1st_term')
    name = models.CharField(max_length=50, default=f"${assigned_student.username}_${year_span}_${term}_Result")
    uploaded = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    uploaded_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.name

    