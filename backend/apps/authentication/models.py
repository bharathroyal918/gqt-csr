from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('super_admin', 'Super Admin'),
        ('csr_manager', 'CSR Manager'),
        ('pto', 'Placement Officer (PTO)'),
        ('principal', 'Principal / Dean'),
        ('hr_recruiter', 'HR Recruiter'),
        ('faculty_coordinator', 'Faculty Coordinator'),
        ('management', 'Executive Management'),
        ('student', 'Student Candidate'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role_key = models.CharField(max_length=50, choices=ROLE_CHOICES, default='student')
    employee_id = models.CharField(max_length=50, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    avatar_url = models.URLField(blank=True, null=True)
    department = models.CharField(max_length=100, blank=True, null=True)
    college_name = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=20, default='active')
    two_factor_enabled = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.email} ({self.get_role_key_display()})"
