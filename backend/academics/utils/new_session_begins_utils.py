from django.db import transaction
from django.core.cache import cache
from datetime import datetime
from django.db.models import Q
from academics.models import ClassRoom, Subject
from academics.serializers import FailedStudentSerializer
from user.models import User

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
    for level in CLASS_PROGRESSION.keys():
        if current_class_name.startswith(level):
            section = current_class_name[len(level):]  # Extract section
            next_level = CLASS_PROGRESSION.get(level)
            if next_level:
                return next_level if next_level == "Grad" else f"{next_level}{section}"
            return None
    return None


def migrate_students(session):
    print(f"Migration started at {datetime.now()}")
    students = User.objects.filter(
        is_student_or_teacher=True).prefetch_related("classes").all()
    total_students = students.count()
    migrated_count = 0
    failed_students = []
    failed_transfers = []

    with transaction.atomic():
        for student in students:
            try:
                if session in student.migrated_sessions:
                    continue  # Skip if already migrated

                current_classes = list(student.classes.all())
                if not current_classes:
                    failed_students.append(student)
                    continue

                new_classes = []
                previous_classes = []

                for classroom in current_classes:
                    next_class_name = get_next_class(classroom.name)
                    if not next_class_name:
                        failed_students.append(student)
                        continue

                    next_class, _ = ClassRoom.objects.get_or_create(
                        name=next_class_name)
                    new_classes.append(next_class)
                    previous_classes.append(classroom.name)

                if new_classes:
                    # Update many-to-many relationship
                    student.classes.set(new_classes)
                    student.migrated_sessions.append(session)

                    # Save previous classes in JSONField
                    student.previous_classes = (
                        student.previous_classes or []
                    ) + previous_classes

                    student.save()
                    migrated_count += 1

                    # Process Subject Transfer
                    process_subject_transfer(
                        student, previous_classes, new_classes, failed_transfers)

                # Update cache progress
                progress = (migrated_count / total_students) * 100
                cache.set("migration_progress", progress, timeout=600)

            except Exception as e:
                failed_students.append(student)

    return {
        "migrated": migrated_count,
        "failed_students": FailedStudentSerializer(failed_students, many=True).data,
        "failed_transfers": failed_transfers,
        "session": session
    }


def process_subject_transfer(student, previous_classes, new_classes, failed_transfers):
    """Handles subject migration for students."""
    try:
        previous_subjects = Subject.objects.filter(
            Q(name__startswith=tuple(previous_classes))
        )

        previous_subject_names = [subj.name for subj in previous_subjects]
        student.subjects.remove(*previous_subjects)  # Remove old subjects

        for prev_subject in previous_subject_names:
            # Extract the subject name after the class prefix
            subject_name = prev_subject.split("_", 1)[-1]

            for new_class in new_classes:
                new_subject_name = f"{new_class.name}_{subject_name}"

                try:
                    new_subject = Subject.objects.get(name=new_subject_name)
                    student.subjects.add(new_subject)
                except Subject.DoesNotExist:
                    failed_transfers.append({
                        "student": student.username,
                        "classroom": new_class.name,
                        "failed_subject": new_subject_name,
                        "reason": "Subject not found"
                    })
                except Exception as e:
                    failed_transfers.append({
                        "student": student.username,
                        "classroom": new_class.name,
                        "failed_subject": new_subject_name,
                        "reason": str(e)
                    })
    except Exception as e:
        failed_transfers.append({
            "student": student.username,
            "classroom": "N/A",
            "failed_subject": "General Subject Transfer Error",
            "reason": str(e)
        })
