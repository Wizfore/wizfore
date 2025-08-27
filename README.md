# 🌟 위즈포레 사회서비스센터 웹사이트

> **"함께 어우러지는 지혜의 숲"** - 위즈포레는 장애인을 포함한 모든 사람들이 어우러져 더불어 살아가는 힘을 키우는 전문 사회서비스센터입니다.

## 📖 프로젝트 소개

위즈포레 사회서비스센터는 2016년부터 부산 사상구에서 운영되고 있는 종합사회서비스센터입니다. 영유아부터 성인까지 생애주기별 맞춤형 치료 및 교육 서비스를 제공하며, 개인별 특성을 고려한 전문적인 사회서비스를 통해 지역사회와 함께 성장하고 있습니다.

이 웹사이트는 Next.js 14의 최신 기술을 활용하여 완전히 새롭게 구축된 모던 웹 애플리케이션으로, 사용자 친화적인 인터페이스와 관리자를 위한 통합 관리 시스템을 제공합니다.

## 🚀 주요 특징

### 💫 사용자 경험
- **반응형 디자인**: 모든 디바이스에서 최적화된 경험
- **Magic UI 통합**: 현대적이고 매력적인 사용자 인터페이스
- **매끄러운 애니메이션**: Framer Motion을 활용한 부드러운 인터랙션
- **직관적 내비게이션**: 정보 접근성을 고려한 사용자 중심 설계

### 🏢 센터 소개
- **센터장 소개**: 전문성과 경력, 비전 메시지
- **전문 자문위원단**: 8명의 다양한 분야 전문가
- **센터 발자취**: 2016년부터 현재까지의 성장 과정과 주요 성과
- **시설 안내**: 치료실, 상담실 등 전문 시설 소개
- **오시는 길**: 상세한 교통 안내 및 지도

### 🎯 프로그램 안내
- **치료 프로그램**: 언어치료, 인지치료, 놀이치료, 미술치료, 음악치료, 감각통합치료, 특수체육, 심리운동치료 (8개 분야)
- **상담 프로그램**: 발달/심리검사, 사회성 그룹치료, 부모상담/코칭
- **방과후 프로그램**: 토요방과후(사회성교실), 평일방과후(기초학습교실)
- **장애인 스포츠**: 뉴스포츠, 특수체육 운동재활
- **성인 주간활동**: 6개 영역 통합 프로그램 (일상생활기술, 사회적응, 쉼, 재미, 지역사회활용, 건강관리)

### 👥 전문진 소개
- **치료·상담사**: 27명의 전문 치료사 (국가자격 보유, 다양한 전문 분야)
- **주간·방과후 교사**: 7명의 전문 교사진 (사회복지, 특수교육, 간호 등)

### 📢 커뮤니티
- **뉴스 시스템**: 5개 카테고리 분류 (공지사항, 협약, 소식, 행사, 수상)
- **SNS 연동**: YouTube 채널 통합
- **1:1 문의**: 5개 카테고리별 문의 시스템

### ⚙️ 관리자 기능
- **Firebase Auth**: 역할 기반 인증 시스템 (admin, staff, viewer)
- **통합 관리 대시보드**: 모든 콘텐츠 통합 관리
- **실시간 콘텐츠 관리**: 뉴스, 프로그램, 팀 정보 등 실시간 편집
- **문의 관리**: 카테고리별 문의 응답 및 상태 관리
- **이미지 관리**: Firebase Storage 기반 이미지 업로드/관리
- **TipTap 에디터**: 풍부한 텍스트 편집 기능

## 🛠 기술 스택

### 핵심 기술
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS Variables
- **Animation**: Framer Motion
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage
- **Deployment**: Vercel

### UI 컴포넌트
- **Design System**: Radix UI + shadcn/ui
- **Magic UI**: 현대적 UI 컴포넌트
- **Forms**: React Hook Form + Zod 검증
- **Rich Text Editor**: TipTap (이미지, 링크, 스타일링 지원)

### 개발 도구
- **Version Control**: Git
- **Package Manager**: npm
- **Linting**: ESLint + Prettier
- **Type Checking**: TypeScript 엄격 모드

## 📁 프로젝트 구조

```
src/
├── app/                     # Next.js 14 App Router
│   ├── (site)/             # 사용자 페이지 (about, programs, team, community, contact)
│   ├── admin/              # 관리자 페이지
│   └── layout.tsx          # 루트 레이아웃
├── components/             # 재사용 가능한 컴포넌트 (181개 파일)
│   ├── layout/             # 레이아웃 컴포넌트 (Header, Footer)
│   ├── home/               # 홈페이지 전용 컴포넌트
│   ├── about/              # 센터 소개 컴포넌트
│   ├── admin/              # 관리자 전용 컴포넌트
│   ├── auth/               # 인증 관련 컴포넌트
│   ├── ui/                 # 기본 UI 컴포넌트
│   └── magicui/            # Magic UI 컴포넌트
├── lib/                    # 라이브러리 및 서비스
│   ├── firebase.ts         # Firebase 설정
│   ├── services/           # 비즈니스 로직 서비스 (7개)
│   ├── data/               # 기본 데이터 및 설정
│   └── utils/              # 유틸리티 함수
├── types/                  # TypeScript 타입 정의 (8개 파일)
├── contexts/               # React Context (인증, 내비게이션)
├── hooks/                  # Custom Hooks (4개)
└── assets/                 # 폰트 등 정적 자산
```

### Firebase Firestore 구조
```
siteInfo/main         # 사이트 기본 정보
aboutInfo/main        # 센터 소개 정보
programs/main         # 프로그램 정보
team/main             # 팀 정보
community/main        # 커뮤니티 정보
homeConfig/main       # 홈페이지 설정
users/{uid}           # 사용자 정보
inquiries/{id}        # 문의 정보
```

## 🔥 핵심 구현 사항

### 🎨 사용자 인터페이스
- **홈페이지**: 히어로 섹션, 카테고리 카드, 센터 소개, 프로그램 그리드, 주요 사업 분야
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 최적화
- **Magic UI 통합**: 현대적이고 매력적인 컴포넌트 활용
- **애니메이션**: Framer Motion을 활용한 부드러운 전환 효과

### 🔐 인증 및 권한
- **Firebase Auth**: 이메일/비밀번호 인증
- **역할 기반 권한**: admin(전체 관리)
- **withAuth HOC**: 페이지별 권한 제어
- **보안**: Firebase Security Rules 적용

### 📊 데이터 관리
- **Firestore 구조**: 8개 컬렉션으로 체계적 데이터 관리
- **서비스 레이어**: 7개 서비스로 비즈니스 로직 분리
- **실시간 업데이트**: Firestore 실시간 기능 활용
- **이미지 관리**: Firebase Storage 기반 업로드/삭제

### 🖊️ 콘텐츠 관리
- **TipTap 에디터**: 풍부한 텍스트 편집 (제목, 스타일, 목록, 정렬, 색상, 이미지 등)
- **다중 이미지 업로드**: 드래그앤드롭 지원
- **실시간 미리보기**: 편집 중 실시간 변경사항 확인
- **자동 저장**: 변경사항 자동 감지 및 저장

## 🌐 Firebase 구조

### Firestore Collections
```
siteInfo/main           # 사이트 기본 정보 및 연락처
aboutInfo/main          # 센터 소개 (센터장, 자문위원, 연혁, 시설, 위치)
programs/main           # 프로그램 정보 (5개 프로그램)
team/main               # 팀 정보 (치료사, 교사)
community/main          # 커뮤니티 (뉴스 카테고리, SNS)
homeConfig/main         # 홈페이지 설정
users/{uid}             # 사용자 정보 및 권한
inquiries/{id}          # 1:1 문의 데이터
```

### Storage 구조
```
images/
├── hero/               # 히어로 이미지
├── programs/           # 프로그램 이미지
├── facilities/         # 시설 이미지
├── news/               # 뉴스 이미지
└── uploads/            # 기타 업로드 이미지
```

## 🚀 시작하기

### 환경 요구사항
- Node.js 18+ 
- npm 또는 yarn

### 설치 및 실행
```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env.local
# Firebase 설정 정보 입력

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 타입 검사
npm run type-check

# 린팅
npm run lint
```

### 환경 변수
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 🔐 관리자 계정 생성

### Firebase Console을 통한 계정 생성 (권장)

1. **Firebase Console 접속**: https://console.firebase.google.com
2. **프로젝트 선택**: 해당 Firebase 프로젝트 선택
3. **Authentication 메뉴**: 왼쪽 사이드바에서 "Authentication" 클릭
4. **Users 탭**: "Users" 탭 선택
5. **Add user**: "Add user" 버튼 클릭
6. **계정 정보 입력**:
   - Email: `admin@wizfore.com` (또는 원하는 이메일)
   - Password: 6자리 이상 강력한 비밀번호

### 권한 설정 (필수)

Firebase Auth에서 계정을 생성한 후, **반드시 Firestore에서 권한을 설정**해야 합니다:

1. **Firestore Database 메뉴**: "Firestore Database" 클릭
2. **users 컬렉션**: `users` 컬렉션 선택 (없으면 생성)
3. **문서 추가**: 생성한 사용자의 UID를 문서 ID로 사용
4. **권한 데이터 입력**:
   ```javascript
   {
     uid: "생성된_사용자_UID",
     email: "admin@wizfore.com",
     displayName: "관리자",
     role: "admin",
     createdAt: "현재_시간",
     lastLogin: "현재_시간", 
     isActive: true
   }
   ```

### 역할별 권한

- **admin**: 전체 관리 권한 (모든 기능 접근)

### 개발 도구를 이용한 방법

관리자 로그인 후 `/admin/dev-tools` 페이지에서:
- **기본 계정 정보**: 
  - 관리자: `admin@wizfore.com / wizfore123`

## 🎯 핵심 기능 상세

### 👤 사용자 기능
- **센터 정보 탐색**: 직관적인 내비게이션으로 원하는 정보에 빠르게 접근
- **프로그램 검색**: 5개 분야의 전문 프로그램 상세 정보 제공
- **전문진 소개**: 34명의 전문가 프로필 및 전문 분야 안내
- **뉴스 확인**: 5개 카테고리의 센터 소식 및 성과 확인
- **온라인 문의**: 5개 카테고리별 맞춤형 문의 시스템

### 🔧 관리자 기능
- **통합 대시보드**: 전체 시스템 현황 모니터링
- **콘텐츠 관리**: 모든 페이지 내용 실시간 편집
- **멀티미디어 관리**: 이미지 업로드/삭제/최적화
- **문의 관리**: 카테고리별 문의 접수 및 응답 관리
- **권한 관리**: 사용자별 접근 권한 제어

### 🎨 디자인 시스템
- **일관된 컬러팔레트**: 브랜드 아이덴티티 반영
- **타이포그래피**: SCDream 폰트 활용 가독성 최적화
- **컴포넌트 라이브러리**: 재사용 가능한 181개 컴포넌트
- **반응형 그리드**: 모든 화면 크기에 최적화

## 📈 성능 최적화

- **Server Components**: Next.js 14의 서버 컴포넌트 적극 활용
- **이미지 최적화**: Next.js Image 컴포넌트 사용
- **코드 스플리팅**: 페이지별 청크 분할로 초기 로딩 최적화
- **Firebase 캐싱**: 적절한 캐싱 전략으로 응답 속도 향상

## 🔒 보안

- **Firebase Security Rules**: 데이터베이스 접근 제어
- **클라이언트/서버 검증**: 이중 권한 확인 시스템
- **안전한 파일 업로드**: 파일 타입 및 크기 제한
- **XSS 방지**: 입력 데이터 검증 및 이스케이핑

## 📱 접근성

- **WCAG 2.1 AA**: 웹 접근성 가이드라인 준수
- **시맨틱 마크업**: 스크린 리더 최적화
- **키보드 내비게이션**: 키보드만으로 모든 기능 접근 가능
- **대체 텍스트**: 모든 이미지에 적절한 alt 속성 제공

## 🌍 배포 및 운영

### Vercel 배포
- **자동 배포**: GitHub push 시 자동 빌드 및 배포
- **환경 변수**: Vercel 대시보드에서 안전한 환경 변수 관리
- **도메인**: 커스텀 도메인 연결 및 SSL 인증서 자동 적용

### 모니터링
- **Vercel Analytics**: 사용자 접근 및 성능 모니터링
- **Firebase Console**: 데이터베이스 및 인증 현황 모니터링
- **Error Boundary**: 클라이언트 오류 처리 및 리포팅

## 🛡️ 품질 보장

- **TypeScript 엄격 모드**: 컴파일 타임 오류 방지
- **ESLint + Prettier**: 코드 품질 및 일관성 유지
- **React Hook Form + Zod**: 폼 검증 및 사용자 입력 처리
- **Error Handling**: 포괄적인 오류 처리 및 사용자 피드백

## 📞 연락처 및 지원

**위즈포레 사회서비스센터**
- 📍 주소: 부산광역시 사상구 모라동 110번길 25 3층, 4층
- ☎️ 전화: 051-324-0940
- 📠 팩스: 051-313-0322  
- 📧 이메일: wizfore@naver.com
- 🌐 웹사이트: www.wizfore.com
- 🕒 운영시간: 평일 09:00~19:00, 주말 09:00~18:00

## 🤝 기여 및 개발

### 개발 워크플로우
1. 브랜치 생성: `git checkout -b feature/기능명`
2. 개발 및 테스트: 기능 개발 후 타입 검사 및 린팅
3. 커밋: `git commit -m "feat: 기능 추가"`
4. 푸시: `git push origin feature/기능명`
5. Pull Request 생성

### 코딩 스타일
- **컴포넌트**: PascalCase (예: `HomeSection`)
- **파일명**: kebab-case (예: `home-section.tsx`)
- **함수/변수**: camelCase (예: `getUserData`)
- **상수**: UPPER_SNAKE_CASE (예: `API_BASE_URL`)

---

© 2025 위즈포레 사회서비스센터. All rights reserved.

**Built with ❤️ using Next.js 14, TypeScript, and Firebase**

> 이 프로젝트는 위즈포레 사회서비스센터의 디지털 혁신을 통해 더 많은 사람들에게 전문적인 사회서비스를 제공하고자 하는 목표로 개발되었습니다. 모든 사람이 함께 어우러져 성장할 수 있는 디지털 공간을 만들어가겠습니다.
