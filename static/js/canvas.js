class CanvasApp {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.colorPicker = document.getElementById('color');
        this.pixelCount = document.getElementById('pixel-count');
        
        // 캔버스 상태
        this.isDrawing = false;
        this.currentColor = '#FF0000';
        this.pixels = new Map();
        this.zoom = 1;
        this.offsetX = 0;
        this.offsetY = 0;
        this.isDragging = false;
        this.lastX = 0;
        this.lastY = 0;
        
        // WebSocket 연결
        this.socket = null;
        this.connectWebSocket();
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadCanvasData();
        this.updatePixelCount();
    }
    
    setupEventListeners() {
        // 색상 선택기
        this.colorPicker.addEventListener('change', (e) => {
            this.currentColor = e.target.value;
        });
        
        // 캔버스 이벤트
        this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
        this.canvas.addEventListener('wheel', this.onWheel.bind(this));
        
        // 줌 컨트롤
        document.getElementById('zoom-in').addEventListener('click', () => this.zoomIn());
        document.getElementById('zoom-out').addEventListener('click', () => this.zoomOut());
        document.getElementById('reset-view').addEventListener('click', () => this.resetView());
        
        // 터치 이벤트 (모바일 지원)
        this.canvas.addEventListener('touchstart', this.onTouchStart.bind(this));
        this.canvas.addEventListener('touchmove', this.onTouchMove.bind(this));
        this.canvas.addEventListener('touchend', this.onTouchEnd.bind(this));
    }
    
    connectWebSocket() {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws/canvas/`;
        
        this.socket = new WebSocket(wsUrl);
        
        this.socket.onopen = () => {
            console.log('WebSocket 연결됨');
        };
        
        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'pixel_update') {
                this.updatePixelFromWebSocket(data.x, data.y, data.color);
            }
        };
        
        this.socket.onclose = () => {
            console.log('WebSocket 연결 해제됨');
            // 재연결 시도
            setTimeout(() => this.connectWebSocket(), 3000);
        };
        
        this.socket.onerror = (error) => {
            console.error('WebSocket 오류:', error);
        };
    }
    
    async loadCanvasData() {
        try {
            const response = await fetch('/api/get-canvas-data/');
            const data = await response.json();
            
            if (data.canvas_data) {
                this.pixels = new Map(Object.entries(data.canvas_data));
                this.renderCanvas();
            }
        } catch (error) {
            console.error('캔버스 데이터 로드 실패:', error);
        }
    }
    
    onMouseDown(e) {
        this.isDrawing = true;
        this.isDragging = false;
        this.lastX = e.clientX;
        this.lastY = e.clientY;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left - this.offsetX) / this.zoom);
        const y = Math.floor((e.clientY - rect.top - this.offsetY) / this.zoom);
        
        if (x >= 0 && x < 1000 && y >= 0 && y < 1000) {
            this.drawPixel(x, y);
        }
    }
    
    onMouseMove(e) {
        if (this.isDrawing) {
            const rect = this.canvas.getBoundingClientRect();
            const x = Math.floor((e.clientX - rect.left - this.offsetX) / this.zoom);
            const y = Math.floor((e.clientY - rect.top - this.offsetY) / this.zoom);
            
            if (x >= 0 && x < 1000 && y >= 0 && y < 1000) {
                this.drawPixel(x, y);
            }
        }
        
        // 드래그 처리
        if (e.buttons === 1 && !this.isDrawing) {
            if (!this.isDragging) {
                this.isDragging = true;
            } else {
                const deltaX = e.clientX - this.lastX;
                const deltaY = e.clientY - this.lastY;
                this.offsetX += deltaX;
                this.offsetY += deltaY;
                this.renderCanvas();
            }
            this.lastX = e.clientX;
            this.lastY = e.clientY;
        }
    }
    
    onMouseUp(e) {
        this.isDrawing = false;
        this.isDragging = false;
    }
    
    onWheel(e) {
        e.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
        const newZoom = Math.max(0.1, Math.min(5, this.zoom * zoomFactor));
        
        if (newZoom !== this.zoom) {
            const scale = newZoom / this.zoom;
            this.offsetX = mouseX - (mouseX - this.offsetX) * scale;
            this.offsetY = mouseY - (mouseY - this.offsetY) * scale;
            this.zoom = newZoom;
            this.renderCanvas();
        }
    }
    
    onTouchStart(e) {
        e.preventDefault();
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            const x = Math.floor((touch.clientX - rect.left - this.offsetX) / this.zoom);
            const y = Math.floor((touch.clientY - rect.top - this.offsetY) / this.zoom);
            
            if (x >= 0 && x < 1000 && y >= 0 && y < 1000) {
                this.drawPixel(x, y);
            }
        }
    }
    
    onTouchMove(e) {
        e.preventDefault();
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            const x = Math.floor((touch.clientX - rect.left - this.offsetX) / this.zoom);
            const y = Math.floor((touch.clientY - rect.top - this.offsetY) / this.zoom);
            
            if (x >= 0 && x < 1000 && y >= 0 && y < 1000) {
                this.drawPixel(x, y);
            }
        }
    }
    
    onTouchEnd(e) {
        e.preventDefault();
    }
    
    drawPixel(x, y) {
        const key = `${x},${y}`;
        if (this.pixels.get(key) !== this.currentColor) {
            this.pixels.set(key, this.currentColor);
            this.renderCanvas();
            this.updatePixelCount();
            
            // WebSocket으로 픽셀 업데이트 전송
            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                this.socket.send(JSON.stringify({
                    type: 'pixel_update',
                    x: x,
                    y: y,
                    color: this.currentColor
                }));
            }
            
            // HTTP API로도 전송 (백업)
            this.sendPixelUpdate(x, y, this.currentColor);
        }
    }
    
    updatePixelFromWebSocket(x, y, color) {
        const key = `${x},${y}`;
        if (this.pixels.get(key) !== color) {
            this.pixels.set(key, color);
            this.renderCanvas();
            this.updatePixelCount();
        }
    }
    
    async sendPixelUpdate(x, y, color) {
        try {
            await fetch('/api/update-pixel/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ x, y, color })
            });
        } catch (error) {
            console.error('픽셀 업데이트 전송 실패:', error);
        }
    }
    
    renderCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 줌과 오프셋 적용
        this.ctx.save();
        this.ctx.translate(this.offsetX, this.offsetY);
        this.ctx.scale(this.zoom, this.zoom);
        
        // 모든 픽셀 렌더링
        this.pixels.forEach((color, key) => {
            const [x, y] = key.split(',').map(Number);
            this.ctx.fillStyle = color;
            this.ctx.fillRect(x, y, 1, 1);
        });
        
        this.ctx.restore();
    }
    
    updatePixelCount() {
        this.pixelCount.textContent = `픽셀 수: ${this.pixels.size}`;
    }
    
    zoomIn() {
        this.zoom = Math.min(5, this.zoom * 1.2);
        this.renderCanvas();
    }
    
    zoomOut() {
        this.zoom = Math.max(0.1, this.zoom / 1.2);
        this.renderCanvas();
    }
    
    resetView() {
        this.zoom = 1;
        this.offsetX = 0;
        this.offsetY = 0;
        this.renderCanvas();
    }
}

// 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
    new CanvasApp();
});
