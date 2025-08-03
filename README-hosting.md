# 🚀 SPS ENG 웹사이트 호스팅 가이드

## 📋 무료 호스팅 옵션 비교

### 🎯 **1순위: Netlify (추천)**
- **비용**: 완전 무료
- **트래픽**: 월 100GB (소규모 사이트에 충분)
- **Contact 폼**: 월 100개 제출 무료
- **도메인**: `your-site-name.netlify.app` 무료 제공
- **특징**: 
  - 자동 HTTPS
  - CDN 제공
  - Git 연동 자동 배포
  - 폼 제출 시 자동 이메일 알림

### 🥈 **2순위: Vercel**
- **비용**: 무료 (Hobby 플랜)
- **트래픽**: 월 100GB
- **Contact 폼**: 별도 서비스 연동 필요
- **도메인**: `your-site.vercel.app`

### 🥉 **3순위: GitHub Pages**
- **비용**: 완전 무료
- **트래픽**: 월 100GB
- **Contact 폼**: 별도 서비스 필요 (Formspree 등)
- **도메인**: `username.github.io/repository`

## 🛠️ Netlify 배포 방법

### 방법 1: 드래그 앤 드롭 (가장 간단)
1. https://netlify.com 회원가입
2. 모든 파일을 ZIP으로 압축
3. Netlify 대시보드에 ZIP 파일 드래그 앤 드롭
4. 자동으로 사이트 배포 완료

### 방법 2: Git 연동 (자동 업데이트)
1. GitHub에 코드 업로드
2. Netlify에서 GitHub 저장소 연결
3. 코드 변경 시 자동 재배포

## 📧 Contact 폼 설정

이미 설정 완료된 상태:
- `netlify.toml`: Netlify 설정 파일
- `thank-you.html`: 제출 완료 페이지
- Contact 폼에 Netlify Forms 속성 추가

## 💰 비용 예상

**Netlify 무료 플랜 제한:**
- 대역폭: 월 100GB
- 빌드 시간: 월 300분
- 폼 제출: 월 100개
- 사이트 수: 무제한

**소규모 트래픽에는 완전 무료로 운영 가능!**

## 🌐 도메인 연결 (선택사항)

무료 도메인 옵션:
- `.tk`, `.ml`, `.ga` (Freenom)
- 또는 기존 도메인 연결 가능

## 📞 기술 지원

Contact 폼 테스트 방법:
1. 사이트 배포 후 Contact 폼 작성
2. 제출하면 설정된 이메일로 알림 수신
3. `ellen201502@gmail.com`, `korea2181@gmail.com`로 전송됨

## 🚀 배포 체크리스트

- [ ] Netlify 계정 생성
- [ ] 사이트 파일 업로드
- [ ] Contact 폼 테스트
- [ ] 이메일 알림 확인
- [ ] 도메인 설정 (선택)

이 설정으로 완전 무료로 professional한 웹사이트 운영이 가능합니다!