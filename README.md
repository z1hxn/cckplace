# 🎨 CCK Place

r/place와 같은 거대한 캔버스 웹 애플리케이션입니다. 로그인 없이 자유롭게 픽셀을 그릴 수 있고, 실시간으로 다른 사용자와 협업할 수 있습니다.

## ✨ 주요 기능

- **1000x1000 픽셀 캔버스**: 거대한 공간에서 자유롭게 그림
- **실시간 협업**: WebSocket을 통한 즉시 업데이트
- **로그인 불필요**: 바로 시작할 수 있는 간편한 인터페이스
- **무제한 그리기**: 시간 제한이나 횟수 제한 없음
- **확대/축소**: 마우스 휠과 버튼으로 캔버스 탐색
- **드래그 이동**: 캔버스를 자유롭게 이동
- **모바일 지원**: 터치 인터페이스 지원
- **색상 선택**: 다양한 색상으로 픽셀 그리기

## 🚀 설치 및 실행

### 1. 저장소 클론
```bash
git clone <repository-url>
cd cckplace
```

### 2. 가상환경 생성 및 활성화
```bash
python3 -m venv venv
source venv/bin/activate  # macOS/Linux
# 또는
venv\Scripts\activate  # Windows
```

### 3. 의존성 설치
```bash
pip install -r requirements.txt
```

### 4. 데이터베이스 마이그레이션
```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. 개발 서버 실행
```bash
python manage.py runserver
```

### 6. 브라우저에서 접속
```
http://localhost:8000
```

## 🛠️ 기술 스택

- **Backend**: Django 5.2.5
- **WebSocket**: Django Channels
- **Database**: SQLite (개발용)
- **Frontend**: HTML5 Canvas, Vanilla JavaScript
- **Styling**: CSS3

## 📱 사용법

1. **그리기**: 마우스 클릭으로 픽셀 그리기
2. **색상 변경**: 상단 색상 선택기에서 원하는 색상 선택
3. **확대/축소**: 마우스 휠 또는 우측 상단 버튼 사용
4. **이동**: 마우스 드래그로 캔버스 이동
5. **초기화**: 🏠 버튼으로 뷰 초기화

## 🔧 개발 설정

### 환경 변수
- `DEBUG`: 개발 모드 (기본값: True)
- `SECRET_KEY`: Django 시크릿 키
- `ALLOWED_HOSTS`: 허용된 호스트 (기본값: ['*'])

### 데이터베이스
기본적으로 SQLite를 사용합니다. 프로덕션에서는 PostgreSQL 등을 권장합니다.

## 📁 프로젝트 구조

```
cckplace/
├── cckplace_project/     # Django 프로젝트 설정
├── canvas/               # Canvas 앱
│   ├── models.py        # 픽셀 모델
│   ├── views.py         # HTTP 뷰
│   ├── consumers.py     # WebSocket 소비자
│   └── routing.py       # WebSocket 라우팅
├── templates/            # HTML 템플릿
├── static/               # 정적 파일 (CSS, JS)
├── manage.py            # Django 관리 스크립트
└── requirements.txt     # Python 의존성
```

## 🌟 향후 계획

- [ ] 사용자 계정 시스템
- [ ] 픽셀 히스토리 및 되돌리기
- [ ] 이미지 업로드 및 템플릿
- [ ] 채팅 시스템
- [ ] 통계 대시보드
- [ ] API 문서화

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 문의

프로젝트에 대한 질문이나 제안사항이 있으시면 이슈를 생성해 주세요.

---

**즐거운 그리기 되세요! 🎨✨**
