from django.contrib import admin
from .models import ClassRoom, Subject, Result, UploadList
from user.models import User
# Register your models here.


class ClassRoomAdmin(admin.ModelAdmin):
    list_display = ("id","name", "assigned_teacher")
    search_fields = ['name']
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "assigned_teacher":
            kwargs["queryset"] = User.objects.filter(is_student_or_teacher=False)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)
    def formfield_for_manytomany(self, db_field, request, **kwargs):
        if db_field.name == "students":
            kwargs["queryset"] = User.objects.filter(is_student_or_teacher=True)
        return super().formfield_for_manytomany(db_field, request, **kwargs)
    
class SubjectAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "assigned_teacher")
    search_fields = ['name']

    def formfield_for_manytomany(self, db_field, request, **kwargs):
        if db_field.name == "students_offering":
            kwargs["queryset"] = User.objects.filter(is_student_or_teacher=True)
        return super().formfield_for_manytomany(db_field, request, **kwargs)
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "assigned_teacher":
            kwargs["queryset"] = User.objects.filter(is_student_or_teacher=False)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

class ResultAdmin(admin.ModelAdmin):
    list_display = ("id",  "term", "year_span", "assigned_student")
    search_fields = ['name']

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "assigned_student":
            kwargs["queryset"] = User.objects.filter(is_student_or_teacher=True)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

class UploadListAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at', 'updated_at')

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "assigned_teacher":
            kwargs["queryset"] = User.objects.filter(is_student_or_teacher=False)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

admin.site.register(ClassRoom, ClassRoomAdmin)
admin.site.register(Subject, SubjectAdmin)
admin.site.register(Result, ResultAdmin)
admin.site.register(UploadList, UploadListAdmin)