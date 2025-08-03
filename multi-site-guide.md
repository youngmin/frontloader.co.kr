# 🚀 다중 사이트 호스팅 가이드

## 📊 Netlify 무료 플랜 제한

### ✅ **7개 사이트 완전 가능**
```
✓ 사이트 수: 무제한
✓ 각 사이트별 커스텀 도메인: 가능
✓ 각 사이트별 Contact 폼: 월 100개씩 개별 계산
✓ 총 대역폭: 월 100GB (7개 사이트 합계)
```

## 📋 7개 사이트 구성 예시

### 사이트별 설정
```
1. frontloader.co.kr → SPS ENG (농기계)
2. company2.co.kr → 회사2
3. company3.co.kr → 회사3
4. company4.co.kr → 회사4
5. company5.co.kr → 회사5
6. company6.co.kr → 회사6
7. company7.co.kr → 회사7
```

### 각 사이트별 폴더 구조
```
project-root/
├── site1-frontloader/
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   └── netlify.toml
├── site2-company2/
│   ├── index.html
│   ├── styles.css
│   └── netlify.toml
├── site3-company3/
└── ... (7개 사이트)
```

## 💰 비용 계산

### 무료 플랜 총 한계
- **대역폭**: 월 100GB (7개 사이트 합계)
- **빌드 시간**: 월 300분
- **폼 제출**: 각 사이트별 월 100개
- **팀 멤버**: 1명

### 트래픽 예상 (소규모 사이트)
```
사이트당 월 방문자: 1,000명
사이트당 월 트래픽: ~5GB
7개 사이트 총합: ~35GB

✅ 100GB 한계 내에서 여유롭게 운영 가능
```

## 🛠️ 배포 전략

### 방법 1: 개별 배포 (추천)
```
각 사이트를 별도 Netlify 프로젝트로 배포
- 관리 용이성
- 독립적 업데이트
- 개별 도메인 설정
```

### 방법 2: 모노레포
```
하나의 Git 저장소에 7개 사이트
- 일괄 관리
- 공통 에셋 공유 가능
```

## 📧 Contact 폼 관리

### 각 사이트별 설정
```javascript
// site1 netlify.toml
[[forms]]
  name = "contact-site1"
  [forms.email]
    emails = ["site1@company.com"]

// site2 netlify.toml  
[[forms]]
  name = "contact-site2"
  [forms.email]
    emails = ["site2@company.com"]
```

## 🎯 업그레이드 고려사항

### Pro 플랜 ($19/월) 검토 시점
```
- 월 트래픽 100GB 초과 시
- 고급 분석 필요 시
- 팀 협업 필요 시

하지만 소규모 트래픽이면 무료로 충분!
```

## 🔧 관리 팁

### 사이트별 구분 전략
1. **Netlify 프로젝트명**: 회사명으로 구분
2. **Git 저장소**: 개별 또는 통합 선택
3. **도메인 그룹화**: DNS 관리 효율화
4. **모니터링**: 각 사이트별 Analytics

이 구성으로 7개 사이트 모두 완전 무료로 운영 가능합니다! 🎉