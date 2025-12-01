# 🎾 Catch Tennis

> 테니스 매칭 웹 애플리케이션 - "오늘도 함께, 더 가볍게"

테니스 파트너를 찾고, 매칭하고, 실시간 채팅으로 소통하는 모바일 최적화 웹 플랫폼입니다.

<br/>

## 📋 목차

- [프로젝트 소개](#-프로젝트-소개)
- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [프로젝트 아키텍처](#-프로젝트-아키텍처)
- [시작하기](#-시작하기)
- [주요 기술적 구현](#-주요-기술적-구현)
- [팀 구성](#-팀-구성)

<br/>

## 🎯 프로젝트 소개

**Catch Tennis**는 테니스를 즐기는 사람들을 위한 매칭 플랫폼입니다. 사용자는 원하는 시간과 장소에서 테니스 파트너를 쉽게 찾고, 실시간 채팅으로 소통하며, 프로필을 관리할 수 있습니다.

### 개발 배경
- 테니스를 즐기고 싶지만 파트너를 구하기 어려운 사람들을 위한 솔루션
- 실시간 소통과 간편한 매칭을 통해 테니스 커뮤니티 활성화
- 모바일 최적화로 언제 어디서나 손쉽게 매칭 가능

<br/>

## ✨ 주요 기능

### 1️⃣ 매치 관리 (`/match`)
- **매치 탐색**: 무한 스크롤 기반 매치 목록 조회
- **상세 필터링**:
  - 경기 종류 (단식, 남자 복식, 여자 복식, 혼합 복식)
  - 날짜 범위 (캘린더 기반)
  - 시간 범위 (슬라이더)
  - 정렬 (최신순, 추천순)
  - 상태 (모집중, 모집마감)
- **매치 생성**: 단계별 폼 기반 매치 등록
- **매치 상세**: 경기 정보, 장소(구글 맵), 호스트 프로필, 참가자 정보
- **상태 관리**: 모집중 ↔ 마감 토글

### 2️⃣ 실시간 채팅 (`/chat`)
- **채팅룸 목록**: 페이지네이션 기반 채팅방 관리
- **실시간 메시징**: WebSocket (STOMP over SockJS) 기반 실시간 채팅
- **주요 기능**:
  - 무한 스크롤 메시지 히스토리
  - 날짜 구분선 자동 표시
  - REST API + WebSocket 이중 동기화
  - 자동 재연결 (토큰 갱신 포함)
  - 최대 3회 재시도 후 REST 모드로 폴백

### 3️⃣ 사용자 프로필 (`/profile`)
- **내 프로필**: 프로필 조회 및 수정
- **타 사용자 프로필**: 공개 프로필 조회
- **프로필 정보**:
  - 닉네임 (중복 확인)
  - 성별, 연령대
  - 테니스 경력
  - 프로필 이미지 업로드
- **프로필 완성**: 신규 사용자를 위한 다단계 설문 폼
- **계정 관리**: 정보 수정, 회원 탈퇴, 로그아웃

### 4️⃣ 인증 (`/auth`)
- **카카오 OAuth 2.0**: 간편한 소셜 로그인
- **JWT + Refresh Token**: 안전한 토큰 기반 인증
- **자동 토큰 갱신**: 401 응답 시 자동 갱신 처리

### 5️⃣ 클럽 기능 (`/club`)
- 개발 예정 (Coming Soon)

<br/>

## 🛠 기술 스택

### Frontend
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.2.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7.9.6-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.17-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

### UI Components & Libraries
- **Radix UI**: Headless UI 컴포넌트 (Dropdown, Popover, Slider, Toggle 등)
- **Lucide React**: 아이콘 라이브러리
- **React Day Picker**: 캘린더 및 날짜 선택
- **date-fns**: 날짜 포맷팅 및 조작
- **Class Variance Authority**: 컴포넌트 스타일링 변형 관리
- **Vis.gl Google Maps**: 구글 맵 통합

### Communication
- **@stomp/stompjs**: WebSocket STOMP 프로토콜
- **sockjs-client**: WebSocket 폴백
- **Fetch API**: REST API 통신 (커스텀 래퍼)

### Development Tools
- **ESLint**: 코드 품질 관리
- **TypeScript ESLint**: TypeScript 린트 규칙
- **Vite SVGR**: SVG를 React 컴포넌트로 변환
- **Vite Tsconfig Paths**: 경로 별칭 지원

<br/>

## 📁 프로젝트 아키텍처

### 디렉토리 구조

```
catch-tennis/
├── src/
│   ├── App.tsx                      # 라우터 설정
│   ├── main.tsx                     # React 엔트리 포인트
│   ├── index.css                    # 전역 스타일 + Tailwind
│   │
│   ├── features/                    # 기능별 모듈 (도메인 기반)
│   │   ├── auth/                    # 인증
│   │   │   ├── pages/
│   │   │   ├── hooks/
│   │   │   └── index.ts
│   │   ├── match/                   # 매치 탐색 및 생성
│   │   │   ├── api/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── pages/
│   │   │   ├── utils/
│   │   │   └── common.ts
│   │   ├── chat/                    # 실시간 채팅
│   │   │   ├── api/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/            # WebSocket 서비스
│   │   │   ├── pages/
│   │   │   └── utils/
│   │   ├── profile/                 # 프로필 관리
│   │   │   ├── api/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── pages/
│   │   │   └── utils/
│   │   └── club/                    # 클럽 (WIP)
│   │
│   ├── shared/                      # 공유 리소스
│   │   ├── api/                     # API 레이어
│   │   │   ├── api.ts               # Fetch 래퍼 (JWT 처리)
│   │   │   └── authApi.ts
│   │   ├── components/
│   │   │   ├── atoms/               # 기본 컴포넌트
│   │   │   ├── molecules/           # 조합 컴포넌트
│   │   │   ├── organisms/           # 복잡한 컴포넌트
│   │   │   └── ui/                  # Radix UI 컴포넌트
│   │   ├── hooks/                   # 재사용 가능한 훅
│   │   ├── layouts/                 # 레이아웃 컴포넌트
│   │   ├── types/                   # TypeScript 타입 정의
│   │   ├── utils/                   # 유틸리티 함수
│   │   └── styles/                  # CSS 디자인 시스템
│   │       ├── primitives/          # 기본 토큰
│   │       └── semantics/           # 의미적 스타일
│   │
│   ├── pages/                       # 최상위 페이지
│   └── assets/                      # 이미지 및 아이콘
│       ├── images/
│       └── icons/
│
├── public/                          # 정적 파일
├── package.json                     # 프로젝트 설정 및 의존성
├── tsconfig.json                    # TypeScript 설정
└── vite.config.ts                   # Vite 설정
```

### 아키텍처 특징

#### 1. **Feature-Based 모듈 구조**
- 기능별로 독립적인 모듈 구성 (auth, match, chat, profile, club)
- 각 모듈은 자체 API, 컴포넌트, 훅, 페이지를 포함
- 높은 응집도와 낮은 결합도

#### 2. **Atomic Design Pattern**
- **Atoms**: Button, Input, Spinner 등 기본 빌딩 블록
- **Molecules**: ProfileCard, CourtCard 등 조합 컴포넌트
- **Organisms**: DateTimeSelector 등 복잡한 상호작용 컴포넌트

#### 3. **레이어 분리**
- **Presentation Layer**: React 컴포넌트
- **Business Logic Layer**: Custom Hooks
- **Data Access Layer**: API 모듈 (api.ts)

#### 4. **타입 안전성**
- TypeScript를 활용한 엄격한 타입 체크
- 공통 타입 정의 (`shared/types/`)
- Enum을 통한 상수 관리

<br/>

## 🚀 시작하기

### 필수 요구사항
- Node.js 18 이상
- npm 또는 yarn

### 설치 및 실행

```bash
# 1. 저장소 클론
git clone https://github.com/Samsung-SCSA-25th-Team2/tennis-web-app-fe.git
cd tennis-web-app-fe/catch-tennis

# 2. 의존성 설치
npm install

# 3. 환경 변수 설정
# .env 파일 생성 및 아래 내용 추가
VITE_API_BASE_URL=http://localhost:8888

# 4. 개발 서버 실행
npm run dev

# 5. 브라우저에서 http://localhost:5173 접속
```

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview

# 린트 실행
npm run lint
```

<br/>

## 💡 주요 기술적 구현

### 1. **이중 소스 메시지 관리 (REST + WebSocket)**

채팅 기능에서 REST API와 WebSocket을 함께 사용하여 안정적인 실시간 메시징 구현:

```typescript
// REST API로 기존 메시지 로드 + WebSocket으로 실시간 메시지 수신
// 중복 방지를 위한 메시지 ID 추적
// 페이지네이션 지원
```

**특징**:
- REST API로 메시지 히스토리 로드
- WebSocket으로 실시간 메시지 수신
- 메시지 ID 기반 중복 제거
- 무한 스크롤 페이지네이션

### 2. **스마트 토큰 관리**

JWT 토큰 자동 갱신 및 WebSocket 재연결:

```typescript
// features/auth/hooks/useProcessLogin.ts, shared/api/api.ts
```

**구현 내용**:
- 401 응답 시 자동 토큰 갱신
- 중복 갱신 방지를 위한 단일 Promise 패턴
- WebSocket 재연결 시 토큰 갱신
- 최대 3회 재시도 (지수 백오프) 후 REST 모드 폴백

### 3. **클라이언트 사이드 매치 캐싱**

```typescript
// features/match/utils/matchCache.ts
```

**기능**:
- 필터 조건 기반 캐시 키 생성
- 무한 스크롤 페이지네이션 (커서 기반)
- 캐시 우선 로드 후 신선한 데이터 페치

### 4. **다단계 폼 패턴**

```typescript
// 매치 생성 및 프로필 완성에서 사용
// Stepper 컴포넌트로 시각적 진행 상황 표시
// 설문 기반 온보딩 접근 방식
```

### 5. **모바일 최적화 반응형 디자인**

- **뷰포트 최적화**: 480px 모바일 디바이스 우선
- **Sticky 레이아웃**: 고정 헤더와 푸터
- **Glass Morphism**: 배경 블러 효과
- **커스텀 스크롤바**: 숨김 유틸리티

### 6. **시맨틱 디자인 시스템**

```css
/* styles/primitives/ - 기본 토큰 */
/* styles/semantics/ - 의미적 변수 */
```

- CSS 커스텀 프로퍼티 기반
- Primitive 변수 (색상, 간격, 타이포그래피)
- Semantic 변수 (primary, success, error, warning)
- Tailwind CSS 테마 커스터마이징

### 7. **Custom Hooks 활용**

```typescript
useAuth()                          // 인증 상태 관리
useProfile(userId)                 // 프로필 조회 및 캐싱
useInfiniteMatchList(params)       // 무한 스크롤 매치 목록
useChatRooms()                     // 채팅방 목록 (페이지네이션)
useChatMessages(roomId)            // 채팅 메시지 히스토리
useWebSocket(roomId, onMessage)    // WebSocket 연결 관리
```

<br/>

## 🔧 API 엔드포인트

### Base URL
```
http://localhost:8888
```

### 주요 엔드포인트

#### 인증
- `POST /api/oauth2/authorization/kakao` - 카카오 로그인
- `POST /v1/auth/refresh` - 토큰 갱신
- `GET /v1/auth/status` - 인증 상태 확인

#### 매치
- `GET /v1/matches` - 매치 검색 (필터링)
- `GET /v1/matches/{matchId}` - 매치 상세
- `POST /v1/me/matches` - 매치 생성
- `PATCH /v1/me/matches/{matchId}` - 매치 상태 토글
- `DELETE /v1/me/matches/{matchId}` - 매치 삭제

#### 채팅
- `GET /v1/chat/rooms` - 채팅방 목록
- `GET /v1/chat/rooms/{roomId}/messages` - 메시지 히스토리
- `POST /v1/chat/rooms` - 채팅방 생성
- **WebSocket**: `ws://localhost:8888/ws-stomp`
  - Destination: `/app/chat.send`
  - Topic: `/topic/chatroom.{roomId}`

#### 프로필
- `GET /v1/users/{userId}` - 사용자 프로필 조회
- `PATCH /v1/users/me/update` - 프로필 수정
- `POST /v1/users/complete-profile` - 프로필 완성
- `GET /v1/users/check-nickname` - 닉네임 중복 확인
- `DELETE /v1/users/me/delete` - 회원 탈퇴

<br/>

## 👥 팀 구성
- FE: 김동훈 프로
- BE: 나정원, 박예영 프로
- DevOps: 심현우 프로
- QA/QC: 이미르 프로


<br/>

## 📝 라이센스

This project is licensed under the MIT License.

<br/>

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 [GitHub Issues](https://github.com/Samsung-SCSA-25th-Team2/tennis-web-app-fe/issues)를 통해 연락 주세요.

---

<div align="center">

**Catch Tennis** - 테니스를 사랑하는 모든 이들을 위한 매칭 플랫폼

</div>
