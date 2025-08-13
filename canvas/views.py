from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from .models import Pixel

# Create your views here.

def canvas_view(request):
    """캔버스 메인 페이지"""
    return render(request, 'canvas/canvas.html')

@csrf_exempt
@require_http_methods(["POST"])
def update_pixel(request):
    """픽셀 업데이트 API"""
    try:
        data = json.loads(request.body)
        x = data.get('x')
        y = data.get('y')
        color = data.get('color')
        
        if x is None or y is None or color is None:
            return JsonResponse({'error': 'Missing required fields'}, status=400)
        
        # 픽셀 업데이트 또는 생성
        pixel, created = Pixel.objects.update_or_create(
            x=x, y=y,
            defaults={'color': color}
        )
        
        return JsonResponse({
            'success': True,
            'x': x,
            'y': y,
            'color': color,
            'created': created
        })
        
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

def get_canvas_data(request):
    """캔버스 데이터 조회 API"""
    try:
        pixels = Pixel.objects.all()
        canvas_data = {}
        
        for pixel in pixels:
            canvas_data[f"{pixel.x},{pixel.y}"] = pixel.color
        
        return JsonResponse({'canvas_data': canvas_data})
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
