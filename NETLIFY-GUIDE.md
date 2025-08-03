# 🌐 Netlify 완전 가이드

## 🗑️ 프로젝트(사이트) 삭제 방법

### Step 1: 사이트 설정 접근
1. **https://app.netlify.com** 로그인
2. **삭제할 사이트 클릭** (예: magical-zuccutto-d10093)
3. **"Site settings" 클릭** (좌측 메뉴 하단)

### Step 2: 사이트 삭제
1. **"Site settings" 페이지에서 맨 아래로 스크롤**
2. **"Danger zone" 섹션 찾기**
3. **"Delete this site" 빨간 버튼 클릭**
4. **사이트명 입력 확인** (예: magical-zuccutto-d10093)
5. **"Delete" 최종 확인**

⚠️ **주의**: 삭제하면 복구 불가능!

---

## 🚀 Netlify 기본 사용법

### 1️⃣ 새 사이트 만들기 (2가지 방법)

#### 방법 A: 드래그 앤 드롭 (가장 쉬움)
```
1. "Add new site" → "Deploy manually"
2. 파일들을 웹페이지에 드래그 앤 드롭
3. 즉시 배포 완료
4. 랜덤 URL 생성 (예: amazing-name-123456.netlify.app)
```

#### 방법 B: Git 연동 (자동 배포)
```
1. "Add new site" → "Import from Git"
2. GitHub/GitLab 선택
3. 저장소 선택
4. 빌드 설정
5. 코드 변경 시 자동 재배포
```

### 2️⃣ 사이트 관리

#### 대시보드 메뉴 설명
```
📊 Overview: 사이트 기본 정보, URL, 배포 상태
🚀 Deploys: 배포 히스토리, 로그, 수동 배포
⚙️ Site settings: 도메인, 빌드 설정, 삭제
📝 Forms: Contact 폼 제출 내역
🌐 Domain management: 커스텀 도메인 설정
📈 Analytics: 트래픽 분석 (Pro 플랜)
```

### 3️⃣ 빌드 설정 (중요!)

#### 정적 사이트 (HTML/CSS/JS)
```
Build command: (비워둠)
Publish directory: .
```

#### React/Vue 등 프레임워크
```
Build command: npm run build
Publish directory: dist (또는 build)
```

---

## 🔧 문제 해결

### 🚨 "Page not found" 에러
**원인**: `index.html` 파일을 찾을 수 없음

**해결책**:
1. **Deploys → 최신 배포 클릭 → Browse files**
2. **`index.html`이 루트 폴더에 있는지 확인**
3. **없다면 Publish directory 설정 확인**

### 🚨 빌드 실패
**확인할 것**:
1. **Deploys → 실패한 배포 클릭 → Deploy log 확인**
2. **Build command가 올바른지 확인**
3. **package.json 파일 존재 여부**

### 🚨 Contact 폼 안 됨
**체크리스트**:
1. **Forms 탭에서 폼 인식되었는지 확인**
2. **HTML에 `data-netlify="true"` 속성 있는지**
3. **netlify.toml 파일에 이메일 설정**

---

## 💡 Netlify 팁

### 🎯 사이트명 변경
```
Site settings → Site details → Change site name
your-custom-name.netlify.app으로 변경 가능
```

### 🌐 커스텀 도메인 연결
```
Domain management → Add custom domain
DNS에서 CNAME 또는 A 레코드 설정
무료 SSL 인증서 자동 발급
```

### 📊 배포 롤백
```
Deploys → 이전 배포 선택 → "Publish deploy"
즉시 이전 버전으로 롤백
```

### 🔒 환경변수 설정
```
Site settings → Environment variables
민감한 정보 (API 키 등) 안전하게 저장
```

---

## 📋 권장 워크플로우

### 개발 단계
1. **드래그 앤 드롭으로 빠른 테스트**
2. **정상 작동 확인**
3. **Git 연동으로 자동 배포 설정**

### 운영 단계
1. **커스텀 도메인 연결**
2. **Forms 알림 이메일 설정**
3. **Analytics 모니터링**

---

## 🆓 무료 플랜 제한

```
✅ 포함사항:
- 사이트 수: 무제한
- 대역폭: 월 100GB
- 빌드 시간: 월 300분
- Forms: 월 100개 제출
- SSL 인증서: 무료

❌ 제한사항:
- 팀 협업: 1명만
- 고급 Analytics: 없음
- 우선 지원: 없음
```

---

## 🚨 자주 하는 실수

### ❌ 잘못된 빌드 설정
```
문제: Build command에 불필요한 명령어
해결: 정적 사이트는 비워둠
```

### ❌ 잘못된 폴더 구조
```
문제: index.html이 하위 폴더에 있음
해결: Publish directory 설정 또는 파일 이동
```

### ❌ Forms 설정 누락
```
문제: 폼 제출 안 됨
해결: data-netlify="true" 속성 추가
```

이제 Netlify 사용이 훨씬 쉬워질 겁니다! 🎉