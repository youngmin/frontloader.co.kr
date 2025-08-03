# ✅ 7개 사이트 배포 체크리스트

## 🎯 배포 순서 (권장)

### Phase 1: 첫 번째 사이트 (frontloader.co.kr)
- [ ] Netlify 계정 생성
- [ ] 현재 사이트 배포 테스트
- [ ] 커스텀 도메인 연결 테스트
- [ ] Contact 폼 동작 확인
- [ ] 이메일 알림 테스트

### Phase 2: 나머지 6개 사이트
- [ ] 각 사이트별 Netlify 프로젝트 생성
- [ ] 도메인별 연결
- [ ] Contact 폼 개별 설정
- [ ] 전체 사이트 트래픽 모니터링

## 📋 사이트별 준비사항

### 각 사이트마다 필요한 파일
```
필수 파일:
├── index.html (메인 페이지)
├── styles.css (스타일시트)
├── script.js (자바스크립트)
├── netlify.toml (Netlify 설정)
└── thank-you.html (Contact 완료 페이지)

이미지 폴더:
└── images/ 또는 assets/
```

### 사이트별 커스터마이징 요소
```
- 회사명/로고
- 제품/서비스 내용
- Contact 정보 (이메일, 전화번호)
- 회사 주소
- 업종별 이미지
```

## 🔧 자동화 스크립트

### 사이트 복제 스크립트 (참고용)
```bash
#!/bin/bash
# 기본 템플릿으로 새 사이트 생성

SITE_NAME=$1
COMPANY_NAME=$2
CONTACT_EMAIL=$3

# 폴더 생성
mkdir "site-${SITE_NAME}"
cd "site-${SITE_NAME}"

# 기본 파일 복사
cp ../frontloader.co.kr/* .

# 회사명 일괄 변경
sed -i "s/SPS ENG/${COMPANY_NAME}/g" index.html
sed -i "s/ellen201502@gmail.com/${CONTACT_EMAIL}/g" netlify.toml

echo "사이트 ${SITE_NAME} 생성 완료!"
```

## 📊 성능 모니터링

### 확인할 지표들
```
각 사이트별:
- 월 방문자 수
- 페이지 로딩 속도
- Contact 폼 제출 수
- 트래픽 사용량

전체 계정:
- 총 대역폭 사용량 (100GB 한계)
- 전체 빌드 시간
- 폼 제출 총량
```

## 🚨 주의사항

### 무료 플랜 한계 관리
```
⚠️ 트래픽 100GB 초과 시:
- 사이트 일시 정지 가능
- Pro 플랜 업그레이드 필요 ($19/월)

💡 예방책:
- 이미지 최적화 (압축)
- 불필요한 파일 제거
- CDN 캐싱 활용
```

### 도메인 관리
```
⚠️ DNS 변경 주의사항:
- 기존 이메일 서비스 영향 확인
- MX 레코드 보존
- 서브도메인 설정 검토

💡 안전한 방법:
- 테스트 서브도메인 먼저 연결
- 단계적 DNS 변경
- 백업 DNS 설정 보관
```

## 📞 기술 지원

### 문제 발생 시 체크포인트
1. **사이트 접속 안 됨**: DNS 전파 상태 확인
2. **Contact 폼 안 됨**: 폼 속성 및 이메일 설정 확인  
3. **이미지 안 나옴**: 파일 경로 및 용량 확인
4. **속도 느림**: 이미지 최적화 및 파일 정리

### 유용한 도구들
```
- DNS 체크: https://whatsmydns.net/
- SSL 체크: https://www.ssllabs.com/ssltest/
- 속도 테스트: https://pagespeed.web.dev/
- Netlify 상태: https://netlifystatus.com/
```

이 체크리스트로 7개 사이트 모두 안전하게 배포할 수 있습니다! 🎯