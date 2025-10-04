# 토론 타이머 (Debate Timer)

토론회와 토론 대회를 위한 전문적인 타이머 앱입니다. 세션별, 토론자별 발언 시간을 측정하고 기록할 수 있는 완전한 토론 관리 시스템입니다.

## 🚀 주요 기능

### ⏰ 스마트 타이머
- **경과 시간 표시**: 실시간으로 경과된 시간을 표시
- **사용자 정의 경고시점**: 경고시점을 5초~300초 사이에서 설정 가능
- **연속 카운팅**: 시간 초과 후에도 발언 종료 버튼을 누를 때까지 계속 카운팅
- **시각적 피드백**: 초록색 → 노란색 → 빨간색으로 직관적인 시간 표시

### 📊 발언 기록 시스템
- **세션 관리**: 토론 세션별로 발언 기록 관리
- **토론자별 기록**: 각 토론자의 발언 시간과 시작/종료 시간 기록
- **자동 저장**: 발언 종료 시 자동으로 기록 저장
- **CSV 내보내기**: Excel에서 열 수 있는 CSV 파일로 기록 내보내기

### 🎨 사용자 친화적 인터페이스
- **전체화면 모드**: 프레젠테이션에 적합한 전체화면 지원
- **반응형 디자인**: 다양한 화면 크기에 대응
- **현대적 UI**: 그라데이션과 애니메이션 효과

## 📦 다운로드 및 설치

### 🖥️ macOS
- **DMG 파일**: [토론 타이머-1.0.0-arm64.dmg](https://github.com/your-username/toastmastertimer/releases/latest)
- **설치 방법**: DMG 파일을 더블클릭하여 Applications 폴더로 드래그

### 🪟 Windows
- **설치 파일**: [토론 타이머 Setup 1.0.0.exe](https://github.com/your-username/toastmastertimer/releases/latest) (권장)
- **포터블 파일**: [토론 타이머 1.0.0.exe](https://github.com/your-username/toastmastertimer/releases/latest) (설치 불필요)

## 🎯 사용 방법

### 1️⃣ 발언 시작
1. **세션명 입력**: "2024년 1월 정기토론" 등
2. **토론자명 입력**: "홍길동" 등
3. **타이머 설정**: 발언 시간과 경고시점 설정
4. **"발언 시작"** 버튼 클릭

### 2️⃣ 발언 진행
- **경과 시간**: 실시간으로 경과 시간 표시
- **색상 변화**: 설정한 시점에 따라 색상 변경
- **일시정지/재개**: 필요시 일시정지 가능
- **발언 종료**: "발언 종료" 버튼으로 기록 저장

### 3️⃣ 기록 관리
- **"기록 보기"**: 모든 발언 기록 확인
- **"기록 내보내기"**: CSV 파일로 다운로드
- **"새 발언"**: 다음 토론자 발언 시작

## 🔧 개발자용

### 개발 환경 설정
```bash
# 저장소 클론
git clone https://github.com/your-username/toastmastertimer.git
cd toastmastertimer

# 의존성 설치
npm install

# 개발 모드 실행
npm start
```

### 빌드
```bash
# 모든 플랫폼용 빌드
npm run build:all

# macOS용 빌드
npm run build:mac

# Windows용 빌드
npm run build:win
```

## 📊 활용 예시

### 토론회 운영
- **찬반 토론**: 각 토론자별 발언 시간 측정
- **패널 토론**: 패널별 발언 시간 기록
- **토론 대회**: 참가자별 발언 시간 관리

### 기록 활용
- **시간 분석**: 토론자별 발언 시간 패턴 분석
- **공정성 검증**: 토론자별 공정한 시간 배분 확인
- **보고서 작성**: CSV 파일로 토론 결과 정리

## 🛠️ 기술 스택

- **Electron**: 데스크톱 앱 프레임워크
- **HTML/CSS/JavaScript**: 프론트엔드
- **Node.js**: 백엔드 런타임
- **LocalStorage**: 데이터 저장

## 📋 시스템 요구사항

- **Windows**: Windows 7 이상
- **macOS**: macOS 10.12 이상
- **메모리**: 최소 100MB RAM
- **디스크**: 최소 200MB 여유 공간

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 📞 문의

프로젝트에 대한 문의사항이나 버그 리포트는 [Issues](https://github.com/your-username/toastmastertimer/issues)를 통해 제출해 주세요.