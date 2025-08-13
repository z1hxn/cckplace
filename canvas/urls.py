from django.urls import path
from . import views

app_name = 'canvas'

urlpatterns = [
    path('', views.canvas_view, name='canvas'),
    path('api/update-pixel/', views.update_pixel, name='update_pixel'),
    path('api/get-canvas-data/', views.get_canvas_data, name='get_canvas_data'),
]
