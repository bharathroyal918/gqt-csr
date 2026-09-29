from django.db import models

class College(models.Model):
    name = models.CharField(max_length=255, unique=True)
    code = models.CharField(max_length=50, unique=True)
    district = models.CharField(max_length=100)
    state = models.CharField(max_length=100, default='Karnataka')
    tier = models.CharField(max_length=10, default='Tier-2')
    mou_signed = models.BooleanField(default=True)
    contact_person = models.CharField(max_length=100, blank=True, null=True)
    contact_email = models.EmailField(blank=True, null=True)
    contact_phone = models.CharField(max_length=20, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.district})"

class Student(models.Model):
    STATUS_CHOICES = [
        ('Registered', 'Registered'),
        ('Eligible', 'Eligible'),
        ('Assessment_Pending', 'Assessment Pending'),
        ('Qualified', 'Qualified Cutoff'),
        ('Interview_Scheduled', 'Interview Scheduled'),
        ('Selected', 'Selected / Offered'),
        ('Rejected', 'Rejected'),
        ('Placed', 'Placed & Joined'),
    ]

    usn = models.CharField(max_length=50, unique=True)
    full_name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    college = models.ForeignKey(College, on_delete=models.SET_NULL, null=True, blank=True, related_name='students')
    college_name = models.CharField(max_length=255, blank=True, null=True)
    department = models.CharField(max_length=100)
    graduation_year = models.PositiveIntegerField(default=2026)
    cgpa = models.DecimalField(max_digits=4, decimal_places=2, default=7.50)
    tenth_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=80.00)
    twelfth_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=80.00)
    hall_ticket_number = models.CharField(max_length=50, blank=True, null=True)
    current_round = models.CharField(max_length=50, default='Aptitude Assessment')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='Registered')
    is_verified = models.BooleanField(default=False)
    resume_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.full_name} ({self.usn})"
