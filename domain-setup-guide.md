# 🌐 커스텀 도메인 설정 가이드

## 📋 도메인 연결 단계

### 1️⃣ Netlify에서 도메인 추가
```
1. Netlify 대시보드 → Site settings
2. Domain management → Add custom domain
3. 기존 도메인 입력 (예: frontloader.co.kr)
```

### 2️⃣ DNS 설정 변경
**옵션 A: Netlify DNS 사용 (추천)**
```
도메인 등록업체에서 네임서버 변경:
- dns1.p08.nsone.net
- dns2.p08.nsone.net
- dns3.p08.nsone.net
- dns4.p08.nsone.net
```

**옵션 B: 기존 DNS 유지**
```
A 레코드 또는 CNAME 추가:
- Type: CNAME
- Name: www (또는 @)
- Value: your-site-name.netlify.app
```

### 3️⃣ SSL 인증서 (자동)
- Let's Encrypt 무료 SSL 자동 발급
- HTTPS 강제 리다이렉트 설정 가능

## 🔧 한국 도메인 주요 등록업체별 설정

### 가비아 (gabia.com)
1. 마이가비아 → 도메인 → DNS 관리
2. 레코드 추가/수정

### 호스팅케이알 (hosting.kr)
1. 도메인 관리 → DNS 설정
2. A레코드 또는 CNAME 설정

### 후이즈 (whois.co.kr)
1. 도메인 관리 → DNS 관리
2. 레코드 설정 변경

## ⚡ 설정 완료 시간
- DNS 변경: 24-48시간 내 전파
- SSL 인증서: 즉시 발급 (도메인 연결 후)