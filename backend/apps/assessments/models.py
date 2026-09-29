from django.db import models
from apps.students.models import Student
from apps.drives.models import CSRDrive

class ExamQuestion(models.Model):
    CATEGORY_CHOICES = [
        ('Aptitude', 'Quantitative Aptitude'),
        ('Logical', 'Logical Reasoning'),
        ('Verbal', 'Verbal Ability'),
        ('Technical', 'Core Technical / CS'),
        ('Coding', 'Coding / Algorithms'),
    ]

    question_id = models.CharField(max_length=50, unique=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Aptitude')
    difficulty = models.CharField(max_length=20, default='Medium')
    question = models.TextField()
    options = models.JSONField(default=list)
    correct_answer = models.PositiveSmallIntegerField(default=0)
    explanation = models.TextField(blank=True, null=True)
    marks = models.DecimalField(max_digits=4, decimal_places=2, default=1.0)
    negative_marks = models.DecimalField(max_digits=4, decimal_places=2, default=0.0)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"[{self.category}] {self.question_id}: {self.question[:50]}..."

class ExamSession(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='exam_sessions')
    drive = models.ForeignKey(CSRDrive, on_delete=models.SET_NULL, null=True, blank=True)
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    total_score = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    passed = models.BooleanField(default=False)
    status = models.CharField(max_length=20, default='In_Progress')
    proctoring_flags = models.PositiveSmallIntegerField(default=0)

    def __str__(self):
        return f"{self.student.usn} - Exam ({self.total_score} pts)"

class ExamResponse(models.Model):
    session = models.ForeignKey(ExamSession, on_delete=models.CASCADE, related_name='responses')
    question = models.ForeignKey(ExamQuestion, on_delete=models.CASCADE)
    selected_option = models.IntegerField(null=True, blank=True)
    is_correct = models.BooleanField(default=False)
    time_spent_seconds = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.session.student.usn} - Q:{self.question.question_id}"
