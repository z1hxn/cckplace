from django.db import models

# Create your models here.

class Pixel(models.Model):
    """캔버스의 각 픽셀을 나타내는 모델"""
    x = models.IntegerField()
    y = models.IntegerField()
    color = models.CharField(max_length=7)  # HEX 색상 코드 (예: #FF0000)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['x', 'y']
        indexes = [
            models.Index(fields=['x', 'y']),
        ]
    
    def __str__(self):
        return f"Pixel({self.x}, {self.y}) - {self.color}"
