from django.db import models

class AuditLog(models.Model):
    module = models.CharField(max_length=100)
    action = models.CharField(max_length=100)
    resource_id = models.CharField(max_length=100, blank=True, null=True)
    user_email = models.EmailField(blank=True, null=True)
    user_role = models.CharField(max_length=50, blank=True, null=True)
    old_value = models.JSONField(default=dict, blank=True)
    new_value = models.JSONField(default=dict, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"[{self.timestamp.strftime('%Y-%m-%d %H:%M')}] {self.user_email} - {self.action} on {self.module}"
