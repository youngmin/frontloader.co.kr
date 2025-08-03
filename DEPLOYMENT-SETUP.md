# 🚀 GitHub + Netlify 자동 배포 설정 가이드

## 📋 1단계: GitHub 저장소 생성

### A. GitHub에서 새 저장소 생성
1. **https://github.com 로그인**
2. **우측 상단 "+" → "New repository" 클릭**
3. **저장소 설정:**
   ```
   Repository name: frontloader-sps-eng
   Description: SPS ENG Farm Implement Manufacturer Website
   Visibility: Public (또는 Private)
   ❌ Initialize with README (이미 있음)
   ❌ Add .gitignore (이미 있음)
   ❌ Choose a license (나중에 추가 가능)
   ```
4. **"Create repository" 클릭**

### B. 생성된 저장소 URL 복사
```
예시: https://github.com/YOUR_USERNAME/frontloader-sps-eng.git
```

## 📋 2단계: 로컬 Git을 GitHub와 연결

### 터미널에서 실행할 명령어들:
```bash
# GitHub 저장소와 연결
git remote add origin https://github.com/YOUR_USERNAME/frontloader-sps-eng.git

# main 브랜치로 변경 (GitHub 기본값)
git branch -M main

# GitHub에 첫 push
git push -u origin main
```

**⚠️ 주의: YOUR_USERNAME을 실제 GitHub 사용자명으로 변경하세요**

## 📋 3단계: Netlify에서 GitHub 연동

### A. Netlify 대시보드 접속
1. **https://netlify.com 로그인**
2. **"Add new site" 클릭**
3. **"Import from Git" 선택**

### B. GitHub 연동 설정
1. **"GitHub" 버튼 클릭**
2. **Netlify에 GitHub 액세스 권한 부여**
3. **저장소 목록에서 "frontloader-sps-eng" 선택**

### C. 빌드 설정
```
Branch to deploy: main
Build command: (비워둠)
Publish directory: . (현재 폴더)
```
4. **"Deploy site" 클릭**

## 📋 4단계: 자동 배포 테스트

### A. 파일 수정하여 테스트
```bash
# 파일 수정 (예: index.html의 title 변경)
echo "<!-- Updated $(date) -->" >> index.html

# Git에 변경사항 커밋
git add .
git commit -m "test: Update timestamp for auto-deploy test"
git push origin main
```

### B. Netlify에서 배포 확인
1. **Netlify 대시보드 → "Deploys" 탭**
2. **자동으로 새 배포 시작됨 확인**
3. **약 2-3분 후 배포 완료**
4. **사이트 URL에서 변경사항 확인**

## 🔧 배포 설정 최적화

### netlify.toml 설정 (이미 포함됨)
```toml
[build]
  publish = "."

[form]
  [form.settings]
    [form.settings.notification]
      emails = ["ellen201502@gmail.com", "korea2181@gmail.com"]

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 환경별 설정
```bash
# Production 환경 확인
# Netlify → Site settings → Environment variables
# 필요 시 환경변수 추가 가능
```

## 📱 브랜치 전략 (선택사항)

### 권장 워크플로우:
```
main ← production (자동 배포)
  ↑
develop ← development branch
  ↑
feature/xxx ← 기능 개발
```

### 개발 브랜치 설정:
```bash
# 개발 브랜치 생성
git checkout -b develop
git push -u origin develop

# Netlify에서 develop 브랜치도 배포 설정 가능
# → Deploy contexts → Branch deploys
```

## ✅ 최종 확인 체크리스트

- [ ] GitHub 저장소 생성 완료
- [ ] 로컬 Git → GitHub 연결 완료
- [ ] Netlify GitHub 연동 완료
- [ ] 첫 번째 자동 배포 성공
- [ ] Contact 폼 동작 확인
- [ ] SSL 인증서 활성화 확인
- [ ] 커스텀 도메인 설정 (선택)

## 🚨 문제 해결

### Git 인증 에러 시:
```bash
# Personal Access Token 사용
# GitHub → Settings → Developer settings → Personal access tokens
# 생성된 토큰으로 비밀번호 대신 사용
```

### Netlify 빌드 에러 시:
1. **Netlify 대시보드 → Deploys → 실패한 배포 클릭**
2. **Deploy log 확인**
3. **에러 메시지에 따라 수정**

### Contact 폼 안 될 때:
1. **netlify.toml 파일 확인**
2. **Form detection in Netlify dashboard**
3. **HTML form 속성 확인**

## 🎯 성공 결과

**완료 시 얻게 되는 것:**
- ✅ GitHub 코드 저장소
- ✅ Netlify 자동 배포 파이프라인
- ✅ main 브랜치 push 시 자동 배포
- ✅ 배포 히스토리 관리
- ✅ 롤백 기능
- ✅ 브랜치별 배포 가능

이제 코드를 수정하고 GitHub에 push만 하면 자동으로 사이트가 업데이트됩니다! 🎉