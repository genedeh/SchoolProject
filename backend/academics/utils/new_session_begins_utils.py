from django.db import transaction
from django.core.cache import cache
from datetime import datetime
from django.db.models import Q
from academics.models import ClassRoom, Subject
from academics.serializers import FailedStudentSerializer
from user.models import User
import re
import logging


# Configure logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

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
    "JSS3": "SS1",
    "SS1": "SS2",
    "SS2": "SS3",
    "SSS3": "Grad",
    "SSS1": "SSS2",
    "SSS2": "SSS3",
    "SS3": "Grad",
}


def get_next_class(current_class_name):
    """Return the next class while removing sections like A, B if needed."""
    match = re.match(r"^([A-Za-z]+[0-9]*)([A-Z]?)$", current_class_name)
    if not match:
        return None

    level, section = match.groups()
    next_level = CLASS_PROGRESSION.get(level)

    if next_level:
        # If next level has sections, keep the section, otherwise remove it
        if any(next_level in key for key in CLASS_PROGRESSION.keys()):
            return next_level if next_level == "Grad" else f"{next_level}{section}"
        return next_level if next_level == "Grad" else f"{next_level}{section}"

    return None


def migrate_students(session):
    logger.info(f"Migration started for session {session} at {datetime.now()}")

    students = User.objects.filter(
        is_student_or_teacher=True
    ).prefetch_related("classes").all()

    total_students = students.count()
    migrated_count = 0
    failed_students = []
    failed_transfers = []

    with transaction.atomic():
        for student in students:
            try:
                logger.info(
                    f"Processing student: {student.id} - {student.username}")

                if session in student.migrated_sessions:
                    logger.warning(
                        f"Student {student.id} - {student.username} already migrated for session {session}. Skipping.")
                    continue

                current_classes = list(student.classes.all())
                if not current_classes:
                    logger.error(
                        f"Student {student.id} - {student.username} has no assigned classes.")

                    failed_students.append({
                        "id": student.id,
                        "username": student.username,
                        "profile_picture_url": student.profile_picture.url if student.profile_picture else None,
                        "classes": [cls.name for cls in student.classes.all()],
                        # Example reason
                        "issue": f"Student {student.id} - {student.username} has no assigned classes."
                    })
                    continue

                new_classes = []
                previous_classes = []

                for classroom in current_classes:
                    next_class_name = get_next_class(classroom.name)

                    # Skip students in "Grad" without marking them as failed
                    if classroom.name == "Grad":
                        logger.info(
                            f"Skipping Student {student.id} - {student.username} as they are already in 'Grad'.")
                        continue  # Skip this iteration

                    # If no next class is found, log the warning and continue
                    if not next_class_name:
                        logger.warning(
                            f"Student {student.id} - {student.username} cannot be migrated from {classroom.name} (No progression).")
                        failed_students.append(student)
                        failed_students.append({
                            "id": student.id,
                            "username": student.username,
                            "profile_picture_url": student.profile_picture.url if student.profile_picture else None,
                            "classes": [cls.name for cls in student.classes.all()],
                            # Example reason
                            "issue": f"Student {student.id} - {student.username} cannot be migrated from {classroom.name} (No progression)."
                        })
                        continue  # Skip this iteration

                    # Get or create the next class
                    next_class, _ = ClassRoom.objects.get_or_create(
                        name=next_class_name)
                    new_classes.append(next_class)
                    previous_classes.append(classroom.name)

                if new_classes:
                    student.classes.set(new_classes)
                    student.migrated_sessions.append(session)
                    student.previous_classes = (
                        student.previous_classes or []) + previous_classes
                    student.save()
                    migrated_count += 1

                    logger.info(
                        f"Student {student.id} - {student.username} migrated from {previous_classes} to {new_classes}.")

                    # Process Subject Transfer
                    process_subject_transfer(
                        student, classroom, new_classes, failed_transfers)

                progress = (migrated_count / total_students) * 100
                cache.set("migration_progress", progress, timeout=600)

            except Exception as e:
                logger.exception(
                    f"Error migrating student {student.id} - {student.username}: {e}")
                failed_students.append(student)

    logger.info(
        f"Migration completed for session {session}. Migrated: {migrated_count}, Failed: {len(failed_students)}")

    return {
        "migrated": migrated_count,
        "failed_students": failed_students,
        "failed_transfers": failed_transfers,
        "session": session
    }


def process_subject_transfer(student, classroom, new_classes, failed_transfers):
    """Handles subject migration for students with logging."""
    try:
        previous_subjects = Subject.objects.filter(
            name__startswith=classroom.name, students_offering__id=student.id
        )
        previous_subject_names = [subj.name for subj in previous_subjects]
        student.subjects.remove(*previous_subjects)  # Remove old subjects

        logger.info(
            f"Student {student.id} - {student.username} previous subjects: {previous_subject_names}")

        for prev_subject in previous_subject_names:
            subject_name = prev_subject.split("_", 1)[-1]

            for new_class in new_classes:
                if new_class.name == "Grad":
                    student.subjects.clear()
                    logger.info(
                        f"Skipping subject transfer for student {student.id} - {student.username} because next class is 'Grad'."
                    )
                    continue  # Skip subject migration for Graduated students

                new_subject_name = f"{new_class.name}_{subject_name}"

                try:
                    new_subject = Subject.objects.get(name=new_subject_name)
                    student.subjects.add(new_subject)
                    logger.info(
                        f"Student {student.id} - {student.username} assigned new subject: {new_subject_name}")
                except Subject.DoesNotExist:
                    logger.warning(
                        f"Student {student.id} - {student.username}: Subject {new_subject_name} not found.")
                    failed_transfers.append({
                        "student": student.username,
                        "classroom": new_class.name,
                        "failed_subject": new_subject_name,
                        "reason": "Subject not found"
                    })
                except Exception as e:
                    logger.error(
                        f"Error assigning subject {new_subject_name} to student {student.id} - {student.username}: {e}")
                    failed_transfers.append({
                        "student": student.username,
                        "classroom": new_class.name,
                        "failed_subject": new_subject_name,
                        "reason": str(e)
                    })
    except Exception as e:
        logger.exception(
            f"General subject transfer error for student {student.id} - {student.username}: {e}")
        failed_transfers.append({
            "student": student.username,
            "classroom": "N/A",
            "failed_subject": "General Subject Transfer Error",
            "reason": str(e)
        })
