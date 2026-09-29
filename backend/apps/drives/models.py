from django.db import models

class CSRDrive(models.Model):
    STATUS_CHOICES = [
        ('Planning', 'Planning'),
        ('Registration', 'Registration Active'),
        ('Assessment', 'Online Assessment'),
        ('Interview', 'Interviews & Evaluations'),
        ('Completed', 'Completed / Archived'),
    ]

    drive_code = models.CharField(max_length=50, unique=True)
    title = models.CharField(max_length=255)
    academic_year = models.CharField(max_length=20, default='2025-2026')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='Registration')
    target_districts = models.JSONField(default=list, blank=True)
    total_intake = models.PositiveIntegerField(default=500)
    budget = models.DecimalField(max_digits=12, decimal_places=2, default=1500000.00)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.drive_code} - {self.title} ({self.status})"

class DrivePhase(models.Model):
    PHASE_STATUS = [
        ('Pending', 'Pending'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed'),
        ('Overdue', 'Overdue'),
    ]

    drive = models.ForeignKey(CSRDrive, on_delete=models.CASCADE, related_name='phases')
    phase_number = models.PositiveSmallIntegerField()
    title = models.CharField(max_length=150)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=30, choices=PHASE_STATUS, default='Pending')
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    completion_percentage = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ['phase_number']

    def __str__(self):
        return f"Phase {self.phase_number}: {self.title} [{self.drive.drive_code}]"

class CollegeDriveAllocation(models.Model):
    drive = models.ForeignKey(CSRDrive, on_delete=models.CASCADE, related_name='allocations')
    college_name = models.CharField(max_length=255)
    district = models.CharField(max_length=100)
    quota = models.PositiveIntegerField(default=100)
    registered_count = models.PositiveIntegerField(default=0)
    shortlisted_count = models.PositiveIntegerField(default=0)
    placed_count = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.college_name} ({self.drive.drive_code})"
