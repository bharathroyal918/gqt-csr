import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gqt_backend.settings')
django.setup()

from django.contrib.auth.models import User
from apps.authentication.models import UserProfile
from apps.drives.models import CSRDrive, DrivePhase, CollegeDriveAllocation
from apps.students.models import College, Student
from apps.assessments.models import ExamQuestion
from apps.interviews.models import InterviewRound, InterviewSchedule, EvaluationRubric
from apps.offers.models import OfferLetter
from apps.notifications.models import Notification
from apps.audit.models import AuditLog
from datetime import date, time, timedelta

def seed():
    print("Seeding GQT CSR Platform data...")

    # 1. Seed Roles & Users
    roles_data = [
        ("admin@globalquesttechnologies.com", "super_admin", "Global Admin", "EMP-ADM-01"),
        ("csrmanager@globalquesttechnologies.com", "csr_manager", "CSR Executive Director", "EMP-CSR-01"),
        ("tpo@rvce.edu.in", "tpo", "EMP-tpo-01"),
        ("principal@bmsce.ac.in", "principal", "EMP-principal-01"),
        ("hr@globalquesttechnologies.com", "hr", "EMP-hr-01"),
        ("faculty@msrit.edu", "faculty", "EMP-faculty-01"),
        ("management@globalquesttechnologies.com", "management", "EMP-management-01"),
        ("student@rvce.edu.in", "student", "EMP-student-01"),
    ]

    for email, role_key, full_name, emp_id in roles_data:
        username = email.split('@')[0]
        user, created = User.objects.get_or_create(
            username=username,
            defaults={'email': email, 'first_name': full_name.split()[0], 'last_name': ' '.join(full_name.split()[1:])}
        )
        user.set_password("GqtCsr@2026")
        user.save()

        profile, _ = UserProfile.objects.get_or_create(user=user)
        profile.role_key = role_key
        profile.employee_id = emp_id
        profile.status = "active"
        profile.save()
        print(f"  [User] {email} ({role_key}) -> Ready")

    # 2. Seed Colleges
    colleges_data = [
        ("R.V. College of Engineering", "RVCE", "Bengaluru Urban", "Tier-1"),
        ("B.M.S. College of Engineering", "BMSCE", "Bengaluru Urban", "Tier-1"),
        ("M.S. Ramaiah Institute of Technology", "MSRIT", "Bengaluru Urban", "Tier-1"),
        ("Siddaganga Institute of Technology", "SIT", "Tumakuru", "Tier-2"),
        ("National Institute of Engineering", "NIE", "Mysuru", "Tier-2"),
        ("Basaveshwar Engineering College", "BEC", "Bagalkote", "Tier-3"),
        ("KLS Gogte Institute of Technology", "GIT", "Belagavi", "Tier-2"),
    ]

    created_colleges = []
    for name, code, district, tier in colleges_data:
        college, _ = College.objects.get_or_create(
            code=code,
            defaults={'name': name, 'district': district, 'tier': tier, 'mou_signed': True}
        )
        created_colleges.append(college)
    print(f"  [Colleges] Seeded {len(created_colleges)} partner institutions")

    # 3. Seed CSR Drive & Phases
    drive, _ = CSRDrive.objects.get_or_create(
        drive_code="DNR-2027-AP-01",
        defaults={
            'title': "Andhra Pradesh New Horizon Drive 2027",
            'academic_year': "2026-2027",
            'status': "Interview",
            'target_districts': ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Tirupati", "Kakinada", "Rajahmundry", "Anantapur", "Kurnool", "Ongole"],
            'total_intake': 1000,
            'budget': 30000000.00,
            'start_date': date(2027, 1, 15),
            'end_date': date(2027, 6, 30),
        }
    )

    phases = [
        (1, "College Outreach & MoU Signing", "Completed", 100),
        (2, "Online Candidate Registration", "Completed", 100),
        (3, "Hall Ticket Verification & Allotment", "Completed", 100),
        (4, "Statewide Proctored Online Assessment", "Completed", 100),
        (5, "Cutoff Evaluation & Merit Shortlisting", "Completed", 100),
        (6, "Technical Interview Round 1", "In Progress", 65),
        (7, "HR Interview & Cultural Fitment", "In Progress", 40),
        (8, "Digital Offer Letter Generation & Signing", "Pending", 15),
        (9, "Pre-Placement Skill Training & Onboarding", "Pending", 0),
    ]

    for p_num, title, status, pct in phases:
        DrivePhase.objects.get_or_create(
            drive=drive,
            phase_number=p_num,
            defaults={'title': title, 'status': status, 'completion_percentage': pct}
        )
    print(f"  [Drive] Seeded {drive.drive_code} with 9 workflow phases")

    # 4. Seed Questions
    sample_questions = [
        ("q-apt-01", "Aptitude", "Easy", "What is 25% of 480?", ["100", "110", "120", "140"], 2, "25% of 480 = 120."),
        ("q-apt-02", "Aptitude", "Medium", "Find the next number: 3, 8, 15, 24, 35, ?", ["42", "48", "50", "56"], 1, "Pattern: n^2 - 1. 7^2 - 1 = 48."),
        ("q-tech-01", "Technical", "Medium", "What is the time complexity of searching in a balanced Binary Search Tree?", ["O(1)", "O(n)", "O(log n)", "O(n log n)"], 2, "Balanced BST search is O(log n)."),
        ("q-tech-02", "Technical", "Hard", "Which SQL constraint ensures all values in a column are distinct?", ["PRIMARY KEY", "FOREIGN KEY", "UNIQUE", "CHECK"], 2, "UNIQUE constraint ensures all column values are distinct."),
        ("q-cod-01", "Coding", "Medium", "Which data structure uses LIFO (Last In First Out) principle?", ["Queue", "Stack", "Tree", "Graph"], 1, "Stack uses LIFO."),
    ]

    for qid, cat, diff, qtext, opts, corr, expl in sample_questions:
        ExamQuestion.objects.get_or_create(
            question_id=qid,
            defaults={
                'category': cat,
                'difficulty': diff,
                'question': qtext,
                'options': opts,
                'correct_answer': corr,
                'explanation': expl,
                'marks': 1.0,
                'is_active': True
            }
        )
    print(f"  [Assessments] Seeded baseline MCQ questions")

    # 5. Seed Students
    students_data = [
        ("1RV22CS089", "Pooja Hegde", "pooja.hegde@rvce.edu.in", "9876543210", created_colleges[0], "Computer Science", 8.85, "Selected", "GQT-HT-2026-001"),
        ("1RV22IS045", "Rohan Verma", "rohan.v@rvce.edu.in", "9876543211", created_colleges[0], "Information Science", 7.92, "Interview_Scheduled", "GQT-HT-2026-002"),
        ("1BM22EC034", "Ananya Deshmukh", "ananya.d@bmsce.ac.in", "9876543212", created_colleges[1], "Electronics & Comm", 8.40, "Qualified", "GQT-HT-2026-003"),
        ("1MS22CS112", "Kiran Kumar", "kiran.k@msrit.edu", "9876543213", created_colleges[2], "Computer Science", 8.10, "Placed", "GQT-HT-2026-004"),
    ]

    for usn, name, email, phone, col, dept, cgpa, st, ht in students_data:
        s, _ = Student.objects.get_or_create(
            usn=usn,
            defaults={
                'full_name': name,
                'email': email,
                'phone': phone,
                'college': col,
                'college_name': col.name,
                'department': dept,
                'cgpa': cgpa,
                'status': st,
                'hall_ticket_number': ht,
                'is_verified': True
            }
        )
        if st in ['Selected', 'Placed']:
            OfferLetter.objects.get_or_create(
                student=s,
                defaults={
                    'offer_code': f"OFF-2026-{s.id:04d}",
                    'drive': drive,
                    'role_title': "Associate Software Engineer",
                    'ctc': 650000.00,
                    'joining_date': date(2026, 7, 15),
                    'valid_until': date(2026, 8, 15),
                    'status': "Accepted" if st == 'Placed' else "Issued"
                }
            )

    print(f"  [Students] Seeded candidates and offers")

    # 6. Seed Sample Notifications & Audit Log
    Notification.objects.get_or_create(
        recipient_email="all@globalquesttechnologies.com",
        title="Statewide Drive Phase 6 Underway",
        defaults={
            'message': "Technical interview panels are actively conducting assessments across RVCE, BMSCE and MSRIT centers.",
            'category': "drive",
            'channel': "in_app"
        }
    )

    AuditLog.objects.create(
        module="SYSTEM",
        action="INITIAL_SEED",
        resource_id="DRV-2026-KAR-01",
        user_email="admin@globalquesttechnologies.com",
        user_role="super_admin",
        new_value={"status": "Seeded successfully"}
    )

    print("Data seeding completed successfully!")

if __name__ == '__main__':
    seed()
