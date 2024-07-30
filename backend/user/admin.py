from django.contrib import admin
from .models import User
# Register your models here.

class UserAdmin(admin.ModelAdmin):
    list_display = ('id','username','age', 'is_student_or_teacher', 'email')
    search_fields = ['username']

admin.site.register(User, UserAdmin)

