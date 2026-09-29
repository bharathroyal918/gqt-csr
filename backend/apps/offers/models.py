from django.db import models
from apps.students.models import Student
from apps.drives.models import CSRDrive

class OfferLetter(models.Model):
    STATUS_CHOICES = [
        ('Draft', 'Draft'),
        ('Issued', 'Issued to Candidate'),
        ('Accepted', 'Accepted & Signed'),
        ('Declined', 'Declined by Candidate'),
        ('Revoked', 'Revoked'),
    ]

    offer_code = models.CharField(max_length=50, unique=True)
    student = models.OneToOneField(Student, on_delete=models.CASCADE, related_name='offer')
    drive = models.ForeignKey(CSRDrive, on_delete=models.SET_NULL, null=True, blank=True)
    role_title = models.CharField(max_length=150, default='Graduate Software Engineer')
    ctc = models.DecimalField(max_digits=10, decimal_places=2, default=650000.00)
    joining_location = models.CharField(max_length=150, default='Bengaluru, Karnataka')
    joining_date = models.DateField()
    valid_until = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Issued')
    pdf_url = models.URLField(blank=True, null=True)
    issued_at = models.DateTimeField(auto_now_add=True)
    responded_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.offer_code} - {self.student.full_name} ({self.role_title})"
