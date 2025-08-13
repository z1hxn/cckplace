import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Pixel

class CanvasConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """WebSocket 연결 시 호출"""
        await self.channel_layer.group_add("canvas", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        """WebSocket 연결 해제 시 호출"""
        await self.channel_layer.group_discard("canvas", self.channel_name)

    async def receive(self, text_data):
        """클라이언트로부터 메시지 수신 시 호출"""
        try:
            data = json.loads(text_data)
            message_type = data.get('type')
            
            if message_type == 'pixel_update':
                # 픽셀 업데이트를 데이터베이스에 저장
                await self.save_pixel(data)
                
                # 모든 연결된 클라이언트에게 픽셀 업데이트 브로드캐스트
                await self.channel_layer.group_send(
                    "canvas",
                    {
                        'type': 'broadcast_pixel_update',
                        'x': data['x'],
                        'y': data['y'],
                        'color': data['color']
                    }
                )
                
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                'error': 'Invalid JSON format'
            }))
        except Exception as e:
            await self.send(text_data=json.dumps({
                'error': str(e)
            }))

    @database_sync_to_async
    def save_pixel(self, data):
        """픽셀을 데이터베이스에 저장"""
        x = data.get('x')
        y = data.get('y')
        color = data.get('color')
        
        if x is not None and y is not None and color is not None:
            Pixel.objects.update_or_create(
                x=x, y=y,
                defaults={'color': color}
            )

    async def broadcast_pixel_update(self, event):
        """픽셀 업데이트를 모든 클라이언트에게 브로드캐스트"""
        await self.send(text_data=json.dumps({
            'type': 'pixel_update',
            'x': event['x'],
            'y': event['y'],
            'color': event['color']
        }))
