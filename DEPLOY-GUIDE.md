# 🚀 Netlify 배포 완전 가이드

## 📋 방법 1: 드래그 앤 드롭 (추천 - 가장 간단)

### Step 1: 파일 준비
```bash
# 현재 위치에서 필요한 파일들 확인
# ✅ 이미 준비된 파일들:
- index.html
- styles.css  
- script.js
- netlify.toml
- thank-you.html
- frontloader.co.kr_files/ (이미지 폴더)
```

### Step 2: Netlify 회원가입
1. https://netlify.com 접속
2. "Sign up" 클릭
3. GitHub, GitLab, 또는 이메일로 가입
4. 무료 계정 선택

### Step 3: 사이트 배포
1. Netlify 대시보드에서 "Add new site" 클릭
2. "Deploy manually" 선택
3. **모든 파일을 선택해서 드래그 앤 드롭**
   - index.html
   - styles.css
   - script.js
   - netlify.toml
   - thank-you.html
   - frontloader.co.kr_files/ 폴더
4. 자동으로 배포 시작
5. 2-3분 후 완료!

### Step 4: 사이트 확인
- `https://random-name-12345.netlify.app` 형태의 URL 제공
- 사이트 정상 작동 확인
- Contact 폼 테스트

---

## 📋 방법 2: ZIP 파일 업로드

### Step 1: ZIP 파일 생성
```bash
# 모든 파일을 ZIP으로 압축
zip -r frontloader-site.zip . -x "*.DS_Store" "node_modules/*"
```

### Step 2: ZIP 업로드
1. Netlify 대시보드 → "Add new site"
2. "Deploy manually" 
3. ZIP 파일을 드래그 앤 드롭
4. 자동 배포 완료

---

## 📋 방법 3: Git 연동 (고급 - 자동 업데이트)

### Step 1: Git 저장소 생성
```bash
# Git 초기화 (아직 안 했다면)
git init
git add .
git commit -m "Initial commit: SPS ENG website"

# GitHub에 저장소 생성 후
git remote add origin https://github.com/YOUR_USERNAME/frontloader-website.git
git push -u origin main
```

### Step 2: Netlify Git 연동
1. "Add new site" → "Import from Git"
2. GitHub 연결 허용
3. 저장소 선택
4. 빌드 설정:
   - Build command: (비워둠)
   - Publish directory: . (현재 폴더)
5. "Deploy site" 클릭

---

## 🌐 커스텀 도메인 연결

### Step 1: 도메인 추가
1. 사이트 대시보드 → "Domain settings"
2. "Add custom domain" 클릭
3. 기존 도메인 입력 (예: frontloader.co.kr)
4. "Verify" 클릭

### Step 2: DNS 설정
**옵션 A: CNAME 레코드 (서브도메인용)**
```
Type: CNAME
Name: www
Value: your-site-name.netlify.app
```

**옵션 B: A 레코드 (메인 도메인용)**
```
Type: A
Name: @
Value: 75.2.60.5 (Netlify Load Balancer)
```

### Step 3: SSL 인증서
- 도메인 연결 후 자동으로 Let's Encrypt SSL 발급
- "Force HTTPS" 활성화 권장

---

## 📧 Contact 폼 설정 확인

### 이메일 알림 설정
1. Site settings → Forms
2. Form notifications 확인
3. 설정된 이메일 주소 확인:
   - ellen201502@gmail.com
   - korea2181@gmail.com

### 폼 테스트
1. 배포된 사이트에서 Contact 폼 작성
2. 제출 후 "thank-you" 페이지로 이동 확인
3. 설정된 이메일로 알림 수신 확인

---

## ✅ 배포 체크리스트

- [ ] Netlify 계정 생성
- [ ] 사이트 파일 업로드/배포
- [ ] 사이트 정상 접속 확인
- [ ] Contact 폼 동작 테스트
- [ ] 이메일 알림 수신 확인
- [ ] 커스텀 도메인 연결 (선택)
- [ ] SSL 인증서 활성화 확인

## 🚨 주의사항

### 필수 파일 확인
```
✅ 반드시 포함해야 할 파일:
- index.html (메인 페이지)
- styles.css (스타일)
- script.js (자바스크립트)
- netlify.toml (Netlify 설정)
- frontloader.co.kr_files/ (이미지 폴더)
```

### 제외할 파일
```
❌ 업로드하지 말 파일:
- .DS_Store (Mac 시스템 파일)
- node_modules/ (있다면)
- .git/ (Git 폴더, Git 연동 시에만 필요)
- 백업 파일들 (.bak, .old 등)
```

## 🎯 예상 결과

### 성공 시
- `https://your-site-name.netlify.app` URL 제공
- Contact 폼 완전 작동
- 이메일 알림 자동 발송
- SSL 보안 연결 (HTTPS)
- 글로벌 CDN으로 빠른 로딩

### 소요 시간
- 드래그 앤 드롭: 5분
- 도메인 연결: 24-48시간 (DNS 전파)
- 전체 설정 완료: 1일 이내

배포 완료 후 URL을 알려주시면 확인해드리겠습니다! 🚀