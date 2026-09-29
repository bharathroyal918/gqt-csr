from django.db import models
from apps.students.models import Student
from apps.drives.models import CSRDrive

class InterviewRound(models.Model):
    ROUND_TYPES = [
        ('Technical', 'Technical Interview (Coding & Systems)'),
        ('HR', 'HR & Cultural Fit Round'),
        ('Management', 'Executive Leadership Round'),
    ]

    drive = models.ForeignKey(CSRDrive, on_delete=models.CASCADE, related_name='interview_rounds')
    round_type = models.CharField(max_length=50, choices=ROUND_TYPES, default='Technical')
    round_number = models.PositiveSmallIntegerField(default=1)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.get_round_type_display()} - Round {self.round_number}"

class InterviewSchedule(models.Model):
    STATUS_CHOICES = [
        ('Scheduled', 'Scheduled'),
        ('Completed', 'Completed'),
        ('Rescheduled', 'Rescheduled'),
        ('Cancelled', 'Cancelled'),
        ('No_Show', 'Candidate No-Show'),
    ]

    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='interviews')
    round = models.ForeignKey(InterviewRound, on_delete=models.CASCADE, related_name='schedules')
    panelist_name = models.CharField(max_length=150)
    panelist_email = models.EmailField(blank=True, null=True)
    interview_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    meeting_link = models.URLField(blank=True, null=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='Scheduled')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student.full_name} with {self.panelist_name} on {self.interview_date}"

class EvaluationRubric(models.Model):
    DECISION_CHOICES = [
        ('Select', 'Select / Recommend Next Round'),
        ('Reject', 'Reject'),
        ('Hold', 'Keep on Hold'),
    ]

    interview = models.OneToOneField(InterviewSchedule, on_delete=models.CASCADE, related_name='rubric')
    technical_score = models.PositiveSmallIntegerField(default=7)  # 1 to 10
    communication_score = models.PositiveSmallIntegerField(default=8)
    problem_solving_score = models.PositiveSmallIntegerField(default=7)
    attitude_culture_score = models.PositiveSmallIntegerField(default=8)
    strengths = models.TextField(blank=True, null=True)
    areas_for_improvement = models.TextField(blank=True, null=True)
    final_decision = models.CharField(max_length=20, choices=DECISION_CHOICES, default='Select')
    comments = models.TextField(blank=True, null=True)
    evaluated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Evaluation: {self.interview.student.full_name} -> {self.final_decision}"
