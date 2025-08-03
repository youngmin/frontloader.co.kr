# 🚀 SPS ENG Netlify 배포 가이드

## 📋 배포 준비사항

### ✅ 이미 완료된 사항
- ☑️ Static HTML/CSS/JS 파일들
- ☑️ netlify.toml 설정 파일 
- ☑️ Contact form with Netlify Forms 연동
- ☑️ Thank you 페이지
- ☑️ 반응형 디자인
- ☑️ SEO 최적화

## 🌐 Netlify 배포 방법

### Option 1: Git 연동 배포 (권장)

1. **GitHub Repository 생성**
   ```bash
   # Git 초기화 (아직 안 했다면)
   git init
   git add .
   git commit -m "Initial commit: SPS ENG website"
   
   # GitHub에 push
   git remote add origin https://github.com/[username]/sps-eng-website.git
   git branch -M main
   git push -u origin main
   ```

2. **Netlify 사이트 생성**
   - https://netlify.com 접속
   - "New site from Git" 클릭
   - GitHub 선택 후 저장소 연결
   - Build settings는 자동 감지됨 (netlify.toml 때문에)
   - "Deploy site" 클릭

### Option 2: 드래그 앤 드롭 배포

1. **파일 압축**
   ```bash
   # 필요한 파일들만 압축
   zip -r sps-eng-site.zip . -x "node_modules/*" ".git/*" "*.md"
   ```

2. **Netlify 수동 배포**
   - https://netlify.com/drop 접속
   - 압축파일을 드래그 앤 드롭

## ⚙️ 배포 후 설정

### 1. 도메인 설정
```
Netlify Dashboard → Domain settings → Custom domains
→ Add custom domain → frontloader.co.kr
```

### 2. HTTPS/SSL 설정
```
자동으로 Let's Encrypt SSL 인증서 발급됨
강제 HTTPS 리디렉션 활성화
```

### 3. Form Notifications 설정
```
Forms → Form notifications → Add notification
Email: ellen201502@gmail.com, korea2181@gmail.com
```

## 📧 Contact Form 동작 확인

### Form 필드들:
- Company Name (required)
- Contact Person (required) 
- Email (required)
- Phone
- Product Interest (required)
- Country/Region
- Message (required)

### 스팸 방지:
- Honeypot field: `bot-field`
- Netlify built-in spam detection

## 🔧 성능 최적화 설정

### 캐싱 전략:
- HTML: 1일 캐싱
- Images/Assets: 1년 캐싱
- CSS/JS: 1년 캐싱 (immutable)

### 보안 헤더:
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block  
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin

## 🌍 Custom Domain 설정

### 1. DNS 설정 (도메인 업체에서)
```
Type: CNAME
Name: www
Value: [netlify-site-name].netlify.app

Type: A  
Name: @
Value: 75.2.60.5 (Netlify Load Balancer)
```

### 2. Netlify에서 도메인 추가
```
Site settings → Domain management → Add custom domain
```

## 📊 배포 후 체크리스트

- [ ] 웹사이트 정상 접속 확인
- [ ] 모든 이미지 로딩 확인  
- [ ] Contact form 테스트
- [ ] 모바일 반응형 확인
- [ ] 페이지 로딩 속도 확인
- [ ] 이메일 알림 테스트

## 🚀 배포 URL 예시

- **Netlify 기본 URL**: https://[site-name].netlify.app
- **Custom Domain**: https://frontloader.co.kr

## 📞 지원 연락처

배포 관련 문의:
- **Sales**: +82 10 2181 7788
- **Email**: ellen201502@gmail.com
- **Customer Service**: +82 70 4036 0880

---

💡 **참고**: Netlify 무료 플랜으로도 충분하며, 월 100GB 대역폭과 무제한 SSL 인증서를 제공합니다.