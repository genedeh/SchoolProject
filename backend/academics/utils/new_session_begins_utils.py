from django.db import transaction
from django.core.cache import cache
from datetime import datetime
from academics.models import ClassRoom
from academics.serializers import FailedStudentSerializer
from user.models import User

# Class progression mapping
CLASS_PROGRESSION = {
    "Crech": "Nursery1",
    "Nursery1": "Nursery2",
    "Nursery2": "KG",
    "KG": "Primary1",
    "Primary1": "Primary2",
    "Primary2": "Primary3",
    "Primary3": "Primary4",
    "Primary4": "Primary5",
    "Primary5": "JSS1",
    "JSS1": "JSS2",
    "JSS2": "JSS3",
    "JSS3": "SSS1",
    "SSS1": "SSS2",
    "SSS2": "SSS3",
    "SSS3": "Grad",
}


def get_next_class(current_class_name):
    """Return the next class name based on progression mapping."""
    return CLASS_PROGRESSION.get(current_class_name)


def migrate_students(session):
    print(f"Migration started at {datetime.now()}")
    students = User.objects.filter(
        is_student_or_teacher=False).prefetch_related("classes").all()
    total_students = students.count()
    migrated_count = 0
    failed_students = []

    print(f"Total students: {students}")
    with transaction.atomic():
        for student in students:
            print(student)
            try:
                if session in student.migrated_sessions:
                    continue  # Skip if already migrated

                current_classes = list(student.classes.all())
                if not current_classes:
                    failed_students.append(student)
                    continue

                new_classes = []
                for classroom in current_classes:
                    next_class_name = get_next_class(classroom.name)
                    if not next_class_name:
                        failed_students.append(student)
                        continue

                    next_class, _ = ClassRoom.objects.get_or_create(
                        name=next_class_name)
                    new_classes.append(next_class)

                if new_classes:
                    # Update many-to-many relationship
                    student.classes.set(new_classes)
                    student.migrated_sessions.append(session)
                    student.save()
                    migrated_count += 1

                # Update cache progress
                progress = (migrated_count / total_students) * 100
                cache.set("migration_progress", progress, timeout=600)

            except Exception:
                failed_students.append(student)

    return {
        "migrated": migrated_count,
        "failed_students": FailedStudentSerializer(failed_students, many=True).data,
        "session": session
    }
