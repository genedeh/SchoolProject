import logging
from traceback import print_exc
from django.core.exceptions import ObjectDoesNotExist
from collections import defaultdict
from academics.models import ClassRoom, StudentResult

# Configure logger
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


def get_students_in_classroom(classroom_id):
    try:
        classroom = ClassRoom.objects.get(id=classroom_id)
        students = classroom.students.all()
        logger.info(
            f"Classroom {classroom_id} found with {students.count()} students")
        return students
    except ObjectDoesNotExist:
        logger.error(f"Classroom {classroom_id} not found")
        return None


def calculate_student_performance(student, classroom_id, session):
    results = StudentResult.objects.filter(
        assigned_student=student.id, classroom=classroom_id, session=session)

    logger.info(
        f"Calculating performance for {student.username} (ID: {student.id})...")

    if not results.exists():
        logger.warning(
            f"No results found for {student.username} (ID: {student.id})")
        return None

    subject_totals = {}
    total_percentage = 0
    num_results = results.count()

    logger.debug(f"Found {num_results} result(s) for {student.username}")

    for result in results:
        logger.debug(
            f"Processing result ID {result.id} for {student.username}")

        term_total_score = 0  # Reset for each term
        subject_count = len(result.scores)  # Number of subjects this term

        for subject, score_data in result.scores.items():
            exam_score = score_data.get("exam", 0)
            test_score = score_data.get("test", 0)
            # Total score for this subject in this term
            total_score = exam_score + test_score

            logger.debug(
                f"{subject}: Exam: {exam_score}, Test: {test_score}, Total: {total_score}")

            term_total_score += total_score  # Add to term total
            subject_totals[subject] = subject_totals.get(
                subject, 0) + total_score  # Keep track of cumulative subject scores

        if subject_count > 0:
            # Convert to percentage
            term_percentage = (term_total_score / (subject_count))
            logger.info(f"Term Percentage for {result.id}: {term_percentage}%")

        total_percentage += term_percentage  # Sum up term percentages

    # Compute final overall percentage (average of three terms)
    overall_percentage = total_percentage / len(results)
    print(subject_totals)

    return {
        "student_id": student.id,
        "username": student.username,
        "profile_picture_url": student.profile_picture.url if student.profile_picture else None,
        "subject_totals": subject_totals,
        "overall_percentage": overall_percentage
    }


def rank_students(students_performance):
    logger.info("Ranking students based on overall percentage...")

    ranked_students = sorted(
        students_performance, key=lambda x: x["overall_percentage"], reverse=True)

    for index, student in enumerate(ranked_students):
        position = f"{index + 1}{'st' if index == 0 else 'nd' if index == 1 else 'rd' if index == 2 else 'th'}"
        student["position"] = position

    return ranked_students


def get_best_students_per_subject(students_performance):
    logger.info("Finding best students per subject...")

    subject_best = defaultdict(lambda: {"student": None, "score": 0})

    for student in students_performance:
        for subject, total_score in student["subject_totals"].items():
            if total_score > subject_best[subject]["score"]:
                subject_best[subject] = {
                    "student": student["username"], "score": total_score }

    return dict(subject_best)
