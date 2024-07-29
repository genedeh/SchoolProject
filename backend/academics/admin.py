from django.contrib import admin
from .models import ClassRoom, Subject, Result, UploadList
from user.models import User
# Register your models here.


class ClassRoomAdmin(admin.ModelAdmin):
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "assigned_Teacher":
            kwargs["queryset"] = User.objects.filter(is_student_or_teacher=False)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)
    def formfield_for_manytomany(self, db_field, request, **kwargs):
        if db_field.name == "students":
            kwargs["queryset"] = User.objects.filter(is_student_or_teacher=True)
        return super().formfield_for_manytomany(db_field, request, **kwargs)

admin.site.register(ClassRoom, ClassRoomAdmin)
admin.site.register(Subject)
admin.site.register(Result)
admin.site.register(UploadList)