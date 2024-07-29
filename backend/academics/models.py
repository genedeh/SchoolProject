from django.db import models
from user.models import User

# Create your models here.

class ClassRoom(models.Model):
    name = models.CharField(max_length=8, unique=True)
    no_of_students = models.IntegerField(verbose_name="Number Of Students")
    assigned_Teacher = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    def __str__(self) -> str:
        return self.class_name