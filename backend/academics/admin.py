from django.contrib import admin
from .models import ClassRoom, Subject, Result, UploadList
# Register your models here.

admin.site.register(ClassRoom)
admin.site.register(Subject)
admin.site.register(Result)
admin.site.register(UploadList)