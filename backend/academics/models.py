from django.contrib.auth import get_user_model
from django.db import models
from user.models import User

# Create your models here.


class ClassRoom(models.Model):
    name = models.CharField(max_length=100, unique=True)
    assigned_teacher = models.OneToOneField(
        User, on_delete=models.SET_NULL, null=True, related_name="classrooms")
    students = models.ManyToManyField(User, related_name='classes', blank=True)

    def __str__(self) -> str:
        return self.name


class Subject(models.Model):
    name = models.CharField(max_length=200)
    assigned_teacher = models.ForeignKey(
        User, related_name='subject', on_delete=models.PROTECT, null=True)
    students_offering = models.ManyToManyField(
        User,  related_name='subjects', blank=True)

    def __str__(self) -> str:
        return self.name



class StudentResult(models.Model):
    TERM_CHOICES = [
        ("1st Term", "1st Term"),
        ("2nd Term", "2nd Term"),
        ("3rd Term", "3rd Term"),
    ]

    # Basic result info
    assigned_student = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="results"
    )
    classroom = models.ForeignKey(ClassRoom, on_delete=models.PROTECT, related_name="classroom_results", null=True)
    session = models.CharField(max_length=9)  # e.g., "2025/2026"
    term = models.CharField(max_length=10, choices=TERM_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    uploaded = models.BooleanField(default=False)

    # Scores and remarks stored in JSON fields
    scores = models.JSONField(
        default=dict,
        blank=True,
        null=True,
        help_text="Store scores as {'Math': {'test': 40, 'exam': 60}}"
    )
    general_remarks = models.JSONField(
        default=dict,
        blank=True,
        null=True,
        help_text="Store general remarks and traits as {'politeness': 5, 'sports': 4}"
    )

    # Combined comments
    comments = models.JSONField(
        default=dict,
        blank=True,
        null=True,
        help_text="Store teacher and principal comments as {'Principals_Comment': 'Very Good Student', 'Teachers_Remark':'Very Focused Student', 'Resumption_Date':'25TH OF January 2025'}."
    )

    def __str__(self):
        return f"Result for {self.assigned_student.username} - {self.term} ({self.session})"
