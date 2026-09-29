from django.db import models

class Notification(models.Model):
    CATEGORY_CHOICES = [
        ('system', 'System Broadcast'),
        ('drive', 'Drive Update'),
        ('assessment', 'Assessment Schedule'),
        ('interview', 'Interview Alert'),
        ('offer', 'Offer Release'),
    ]

    recipient_email = models.EmailField()
    recipient_role = models.CharField(max_length=50, blank=True, null=True)
    title = models.CharField(max_length=200)
    message = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='system')
    is_read = models.BooleanField(default=False)
    channel = models.CharField(max_length=50, default='in_app')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.category}] {self.title} -> {self.recipient_email}"

class WhatsAppLog(models.Model):
    phone_number = models.CharField(max_length=20)
    template_name = models.CharField(max_length=100)
    parameters = models.JSONField(default=dict)
    status = models.CharField(max_length=20, default='SENT')
    response_payload = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"WhatsApp: {self.phone_number} ({self.status})"

class EmailLog(models.Model):
    to_email = models.EmailField()
    subject = models.CharField(max_length=255)
    body = models.TextField()
    status = models.CharField(max_length=20, default='SENT')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Email: {self.to_email} ({self.subject})"
