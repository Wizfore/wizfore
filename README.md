# 위즈포레 사회서비스센터 웹사이트

## 🚀 새롭게 리뉴얼된 위즈포레 웹사이트

Next.js 14의 App Router와 TypeScript, Tailwind CSS를 사용하여 완전히 새롭게 구축된 위즈포레 사회서비스센터 웹사이트입니다.

## 🛠 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS Variables
- **Animation**: Framer Motion
- **UI Components**: Radix UI + Magic UI + shadcn/ui
- **Forms**: React Hook Form + Zod
- **Authentication**: Firebase Auth
- **Database**: Cloud Firestore
- **Storage**: Firebase Storage
- **Deployment**: Vercel
- **Version Control**: GitHub

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js 14 App Router
│   ├── (site)/            # 사용자용 페이지
│   │   ├── about/         # 센터 소개
│   │   ├── programs/      # 프로그램 안내
│   │   ├── team/          # 전문가 소개
│   │   ├── community/     # 커뮤니티
│   │   ├── contact/       # 1:1 문의
│   │   └── page.tsx       # 메인 페이지
│   ├── admin/             # 관리자용 페이지
│   ├── layout.tsx         # 루트 레이아웃
│   └── globals.css        # 글로벌 스타일
├── components/            # 재사용 컴포넌트
│   ├── layout/           # 레이아웃 컴포넌트 (Header, Footer)
│   ├── home/             # 홈페이지 섹션
│   ├── about/            # 센터 소개 컴포넌트
│   ├── community/        # 커뮤니티 컴포넌트
│   ├── contact/          # 문의 컴포넌트
│   ├── admin/            # 관리자 컴포넌트
│   ├── auth/             # 인증 컴포넌트
│   ├── magicui/          # Magic UI 컴포넌트
│   └── ui/               # 기본 UI 컴포넌트
├── lib/                  # 유틸리티 & 설정
│   ├── firebase.ts       # Firebase 설정
│   ├── services/         # Firebase 서비스 레이어
│   ├── data/             # 기본 데이터 및 설정
│   └── utils/            # 유틸리티 함수
└── types/                # TypeScript 타입 정의
    └── index.ts
```

## 🔥 주요 기능

### 📱 사용자 기능
- **반응형 디자인**: 모든 디바이스에서 최적화된 경험
- **Magic UI 통합**: 현대적이고 매력적인 인터페이스
- **매끄러운 애니메이션**: Framer Motion을 활용한 부드러운 인터랙션
- **프로그램 소개**: 치료, 스포츠, 방과후, 성인주간보호 프로그램
- **센터 소개**: 센터장 소개, 자문위원, 연혁, 시설 안내
- **팀 소개**: 치료사 및 교사 프로필
- **커뮤니티**: 뉴스 시스템 (카테고리별 분류, 상세 페이지)
- **1:1 문의**: 실시간 문의 시스템 (카테고리별 분류)

### 🔐 관리자 기능
- **Firebase Auth**: 안전한 인증 시스템
- **대시보드**: 통계 및 현황 모니터링
- **콘텐츠 관리**: 뉴스, 프로그램, 팀 정보 관리
- **문의 관리**: 카테고리별 문의 응답 및 관리
- **시스템 관리**: 사이트 설정, 기본 데이터 관리
- **권한 관리**: 역할 기반 접근 제어

## 🚀 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 설정

Firebase 프로젝트를 설정하고 `.env.local` 파일을 생성하세요:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY=your_private_key
```

### 3. 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000에서 개발 서버가 실행됩니다.

### 4. 타입 검사

```bash
npm run type-check
```

### 5. 빌드

```bash
npm run build
```

## 🔧 주요 변경사항

### 이전 구조 → 새로운 구조

- **Pages Router** → **App Router**: Next.js 14의 최신 라우팅 시스템
- **JavaScript** → **TypeScript**: 타입 안정성 향상
- **CSS Modules** → **Tailwind CSS**: 일관된 디자인 시스템
- **정적 컴포넌트** → **애니메이션**: Framer Motion으로 향상된 UX
- **분산된 구조** → **체계적 구조**: 컴포넌트 기반 아키텍처

### 보존된 기능

- **Firebase 인증 및 데이터베이스**: 기존 설정 유지
- **관리자 권한 시스템**: 기존 미들웨어 업그레이드
- **데이터 구조**: Firestore 스키마 호환성 유지

## ✅ 개발 완료 현황

### 완료된 기능
- ✅ **Next.js 14 App Router** 구조 완성
- ✅ **Firebase 인증 시스템** 구현
- ✅ **반응형 디자인** 및 **Magic UI** 통합
- ✅ **뉴스 시스템** (카테고리별 분류, 상세 페이지, 테이블 뷰)
- ✅ **센터 소개 페이지** (센터장, 자문위원, 연혁, 위치)
- ✅ **프로그램 페이지** (치료, 스포츠, 방과후, 성인주간보호)
- ✅ **팀 소개 페이지** (치료사, 교사)
- ✅ **문의 시스템** (카테고리별 분류 저장)
- ✅ **관리자 대시보드** 구조
- ✅ **TypeScript 타입 시스템** 완성
- ✅ **Firebase Firestore** 데이터 구조 설계

### 추가 개발 가능 항목
- [ ] 관리자 페이지 세부 기능 확장
- [ ] 이미지 최적화 및 압축
- [ ] SEO 최적화 (메타 태그, sitemap)
- [ ] 성능 최적화 (코드 스플리팅)
- [ ] 테스트 코드 작성
- [ ] PWA 기능 추가

## 🌐 배포 및 이전

### Vercel 배포

1. GitHub에 푸시
2. Vercel에서 프로젝트 연결
3. 환경 변수 설정
4. 자동 배포 완료

### 환경 변수 설정

Vercel 대시보드에서 다음 환경 변수들을 설정하세요:

**Firebase 설정:**
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

**Firebase Admin (선택사항):**
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

## 🤝 기여

1. 브랜치 생성 (`git checkout -b feature/AmazingFeature`)
2. 변경사항 커밋 (`git commit -m 'Add some AmazingFeature'`)
3. 브랜치에 푸시 (`git push origin feature/AmazingFeature`)
4. Pull Request 생성

## 🏗️ 아키텍처 특징

### Modern Tech Stack
- **App Router**: Next.js 14의 최신 라우팅 시스템
- **Server Components**: 성능 최적화된 서버 컴포넌트
- **TypeScript**: 엄격한 타입 시스템으로 안정성 확보
- **Tailwind CSS**: 유틸리티 퍼스트 CSS 프레임워크

### UI/UX Design
- **Magic UI**: 현대적이고 매력적인 컴포넌트
- **Framer Motion**: 부드러운 애니메이션
- **Responsive Design**: 모바일 퍼스트 반응형 디자인
- **Accessibility**: 웹 접근성 고려

### Backend Integration
- **Firebase Auth**: 안전한 인증 시스템
- **Firestore**: NoSQL 데이터베이스
- **Firebase Storage**: 이미지 및 파일 저장
- **Service Layer**: 체계적인 데이터 관리

## 📞 연락처

위즈포레 사회서비스센터
- 📧 Email: info@wizfore.com
- 📱 Phone: 051-123-4567
- 🌐 Website: https://wizfore.vercel.app

---

© 2025 위즈포레 사회서비스센터. All rights reserved.
