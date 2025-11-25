# tennis-web-app-fe

# 🎾 테니스 웹앱 프로젝트 - React 초보자 가이드



> React를 처음 시작하는 개발자를 위한 친절한 가이드입니다!



## 📚 목차

1. [프로젝트 소개](#-프로젝트-소개)

2. [기술 스택 설명](#-기술-스택-설명)

3. [프로젝트 시작하기](#-프로젝트-시작하기)

4. [프로젝트 구조 이해하기](#-프로젝트-구조-이해하기)

5. [개발 워크플로우](#-개발-워크플로우)

6. [주요 개념 설명](#-주요-개념-설명)

7. [자주 하는 실수와 해결 방법](#-자주-하는-실수와-해결-방법)

8. [유용한 리소스](#-유용한-리소스)



---



## 🎯 프로젝트 소개



이 프로젝트는 **테니스 매칭 웹 애플리케이션**입니다. 사용자들이 테니스 파트너를 찾고, 매칭하고, 채팅하며, 클럽 활동을 할 수 있는 플랫폼입니다.



### 주요 기능

- 🏠 홈: 카카오 로그인 및 시작 화면

- 👤 프로필 완성: 사용자 정보 입력 (다단계 폼)

- 🎾 매칭: 테니스 파트너 찾기

- 💬 채팅: 매칭된 사용자와 대화

- 🏆 클럽: 테니스 클럽 활동

- 📱 프로필: 내 정보 관리



---



## 🛠 기술 스택 설명



### React 19

- **무엇인가요?** 사용자 인터페이스(UI)를 만들기 위한 JavaScript 라이브러리

- **왜 사용하나요?** 컴포넌트 기반으로 재사용 가능한 UI를 쉽게 만들 수 있습니다

- **버전:** 최신 버전인 19를 사용합니다



### TypeScript

- **무엇인가요?** JavaScript에 타입 시스템을 추가한 언어

- **왜 사용하나요?** 코드 작성 중 오류를 미리 발견하고, 자동완성이 잘 됩니다

- **예시:**

  ```typescript

  // JavaScript (타입 없음)

  function add(a, b) {

    return a + b;

  }

 

  // TypeScript (타입 있음)

  function add(a: number, b: number): number {

    return a + b;

  }

  ```



### Vite

- **무엇인가요?** 빠른 개발 서버와 빌드 도구

- **왜 사용하나요?** 기존 Create React App보다 훨씬 빠릅니다 (HMR: Hot Module Replacement)

- **참고:** 코드를 수정하면 즉시 브라우저에 반영됩니다!



### React Router v7

- **무엇인가요?** 페이지 간 이동(라우팅)을 관리하는 라이브러리

- **왜 사용하나요?** 여러 페이지를 가진 앱을 쉽게 만들 수 있습니다

- **예시:** `/match`, `/chat`, `/profile` 같은 URL로 다른 화면을 보여줍니다



### Tailwind CSS v4

- **무엇인가요?** Utility-first CSS 프레임워크

- **왜 사용하나요?** CSS 파일을 따로 작성하지 않고 클래스명으로 스타일링합니다

- **예시:**

  ```tsx

  // 전통적인 CSS

  <div className="my-button">클릭</div>

  // CSS 파일: .my-button { background: blue; padding: 10px; }

 

  // Tailwind

  <div className="bg-blue-500 p-2">클릭</div>

  ```



---



## 🚀 프로젝트 시작하기



### 1단계: 프로젝트 클론 (이미 완료)

```bash

# 현재 위치 확인

pwd

# 출력: /home/user/tennis-web-app-fe

```



### 2단계: 프로젝트 폴더로 이동

```bash

cd catch-tennis

```



### 3단계: 의존성 설치

```bash

npm install

# 또는

npm i

```



**설명:** `package.json`에 정의된 모든 라이브러리를 설치합니다. 처음 한 번만 실행하면 됩니다.



### 4단계: 개발 서버 실행

```bash

npm run dev

```



**설명:** 개발 서버가 시작되고 브라우저에서 앱을 볼 수 있습니다.

- 보통 `http://localhost:5173`에서 실행됩니다

- 코드를 수정하면 자동으로 새로고침됩니다 (HMR)



### 5단계: 브라우저에서 확인

브라우저에서 표시된 주소로 접속하세요!



---



## 📁 프로젝트 구조 이해하기



```

catch-tennis/

├── src/                        # 소스 코드가 여기 있습니다

│   ├── main.tsx               # 📌 앱의 진입점 (시작점)

│   ├── App.tsx                # 📌 라우팅 설정 (페이지 연결)

│   ├── index.css              # 전역 CSS

│   │

│   ├── pages/                 # 📄 페이지 컴포넌트들

│   │   ├── Home.tsx          # 홈 화면

│   │   ├── Match.tsx         # 매칭 페이지

│   │   ├── Chat.tsx          # 채팅 페이지

│   │   ├── Club.tsx          # 클럽 페이지

│   │   ├── Profile.tsx       # 프로필 페이지

│   │   └── ...

│   │

│   ├── features/              # 🎨 기능별 모듈

│   │   └── profileComplete/  # 프로필 완성 기능

│   │       ├── ProfileComplete.tsx  # 메인 컴포넌트

│   │       ├── questions.ts        # 질문 데이터

│   │       ├── types.ts           # 타입 정의

│   │       └── storage.ts         # 로컬 저장소 로직

│   │

│   ├── shared/                # 🔧 공유 리소스

│   │   ├── components/       # 재사용 가능한 컴포넌트

│   │   │   ├── Header.tsx   # 헤더

│   │   │   ├── Footer.tsx   # 푸터

│   │   │   └── atoms/       # 작은 단위 컴포넌트

│   │   │       ├── Button.tsx

│   │   │       ├── InputText.tsx

│   │   │       └── ...

│   │   ├── layouts/          # 레이아웃 컴포넌트

│   │   │   └── MobileLayout.tsx

│   │   ├── hooks/            # 커스텀 훅

│   │   ├── api/              # API 통신

│   │   └── types/            # 공통 타입

│   │

│   ├── styles/               # 스타일 정의

│   │   ├── primitives/      # 기본 디자인 토큰

│   │   │   ├── colors.css

│   │   │   ├── typography.css

│   │   │   └── spacing.css

│   │   └── semantics/       # 의미적 스타일

│   │

│   └── assets/               # 이미지, 아이콘 등

│

├── public/                    # 정적 파일

├── package.json              # 📦 프로젝트 설정 및 의존성

├── tsconfig.json             # TypeScript 설정

├── vite.config.ts            # Vite 설정

└── eslint.config.js          # ESLint 설정 (코드 품질 도구)

```



### 📌 핵심 파일 설명



#### `main.tsx` (진입점)

```tsx

import {StrictMode} from 'react'

import {createRoot} from 'react-dom/client'

import './index.css'

import App from './App.tsx'

 

createRoot(document.getElementById('root')!).render(

    <StrictMode>

        <App/>

    </StrictMode>,

)

```

- **역할:** 리액트 앱을 HTML의 `<div id="root">`에 렌더링합니다

- **StrictMode:** 개발 중 문제를 미리 발견하게 도와줍니다



#### `App.tsx` (라우팅)

```tsx

const router = createBrowserRouter([

    {

        path: "/",

        element: <MobileLayout/>,

        children: [

            { index: true, element: <Home/> },

            { path: "/match", element: <Match/> },

            { path: "/chat", element: <Chat/> },

            // ...

        ]

    }

])

```

- **역할:** URL 경로에 따라 다른 컴포넌트를 보여줍니다

- **MobileLayout:** 모든 페이지의 공통 레이아웃 (헤더, 푸터 포함)



---



## 🔄 개발 워크플로우



### 일반적인 개발 순서



1. **이슈 확인**

    - GitHub Issues나 할 일 목록에서 작업할 내용 확인



2. **브랜치 생성**

   ```bash

   git checkout -b feat/기능명

   # 예: git checkout -b feat/add-profile-image

   ```



3. **개발 서버 실행**

   ```bash

   npm run dev

   ```



4. **코드 작성**

    - 컴포넌트 수정하거나 새로 생성

    - 브라우저에서 실시간으로 확인



5. **린트 체크**

   ```bash

   npm run lint

   ```

    - 코드 스타일 문제를 자동으로 찾아줍니다



6. **빌드 테스트**

   ```bash

   npm run build

   ```

    - 프로덕션 빌드가 정상적으로 되는지 확인



7. **커밋 & 푸시**

   ```bash

   git add .

   git commit -m "feat: 프로필 이미지 업로드 기능 추가"

   git push origin feat/add-profile-image

   ```



8. **Pull Request 생성**

    - GitHub에서 PR 생성하고 코드 리뷰 요청



---



## 💡 주요 개념 설명



### 1. React 컴포넌트란?



컴포넌트는 **재사용 가능한 UI 조각**입니다.



```tsx

// 함수형 컴포넌트 (현재 표준)

function Button({ text, onClick }: { text: string; onClick: () => void }) {

    return (

        <button onClick={onClick} className="bg-blue-500 text-white p-2">

            {text}

        </button>

    )

}

 

// 사용 예시

<Button text="클릭하세요" onClick={() => alert('클릭!')} />

```



### 2. Props (속성)



부모 컴포넌트에서 자식 컴포넌트로 데이터를 전달하는 방법입니다.



```tsx

// 부모 컴포넌트

function ParentComponent() {

    return <ChildComponent name="홍길동" age={25} />

}

 

// 자식 컴포넌트

function ChildComponent({ name, age }: { name: string; age: number }) {

    return <div>이름: {name}, 나이: {age}</div>

}

```



### 3. State (상태)



컴포넌트 내부에서 변경 가능한 데이터입니다.



```tsx

import { useState } from 'react'

 

function Counter() {

    // [현재값, 값을변경하는함수] = useState(초기값)

    const [count, setCount] = useState(0)

 

    return (

        <div>

            <p>카운트: {count}</p>

            <button onClick={() => setCount(count + 1)}>증가</button>

        </div>

    )

}

```



**중요:** State가 변경되면 컴포넌트가 다시 렌더링됩니다!



### 4. Effect (부수 효과)



컴포넌트가 렌더링된 후 실행되는 코드입니다.



```tsx

import { useEffect, useState } from 'react'

 

function UserProfile() {

    const [user, setUser] = useState(null)

 

    // 컴포넌트가 마운트될 때 한 번 실행

    useEffect(() => {

        fetch('/api/user')

            .then(res => res.json())

            .then(data => setUser(data))

    }, []) // 빈 배열 = 한 번만 실행

 

    return <div>{user?.name}</div>

}

```



### 5. 라우팅 이해하기



```tsx

// App.tsx에서 정의

{

    path: "/match",

    element: <Match/>,

}

 

// 링크로 이동

import { Link } from 'react-router-dom'

<Link to="/match">매칭 페이지로</Link>

 

// 프로그래밍 방식으로 이동

import { useNavigate } from 'react-router-dom'

const navigate = useNavigate()

navigate('/match')

```



### 6. TypeScript 타입 정의



```tsx

// 타입 정의 (types.ts)

export interface User {

    id: number

    name: string

    email: string

    profileImage?: string  // ? = 선택적 속성

}

 

// 사용

function UserCard({ user }: { user: User }) {

    return (

        <div>

            <h2>{user.name}</h2>

            <p>{user.email}</p>

            {user.profileImage && <img src={user.profileImage} />}

        </div>

    )

}

```



### 7. 커스텀 훅



여러 컴포넌트에서 재사용할 수 있는 로직입니다.



```tsx

// hooks/useAuth.ts

function useAuth() {

    const [user, setUser] = useState(null)

    const [loading, setLoading] = useState(true)

 

    useEffect(() => {

        // 로그인 체크

        checkAuth().then(user => {

            setUser(user)

            setLoading(false)

        })

    }, [])

 

    return { user, loading }

}

 

// 컴포넌트에서 사용

function MyComponent() {

    const { user, loading } = useAuth()

 

    if (loading) return <div>로딩 중...</div>

    return <div>환영합니다, {user.name}님!</div>

}

```



---



## 🎨 Tailwind CSS 사용법



### 기본 클래스



```tsx

// 배경색

<div className="bg-blue-500">파란 배경</div>

 

// 텍스트

<div className="text-white text-lg font-bold">흰색 큰 굵은 글씨</div>

 

// 여백

<div className="p-4 m-2">

  {/* p-4 = padding: 1rem (16px) */}

  {/* m-2 = margin: 0.5rem (8px) */}

</div>

 

// Flexbox

<div className="flex justify-center items-center">

  {/* 가로/세로 중앙 정렬 */}

</div>

 

// 조합

<button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">

  버튼

</button>

```



### 반응형 디자인



```tsx

<div className="w-full md:w-1/2 lg:w-1/3">

  {/* 모바일: 100%, 태블릿: 50%, 데스크톱: 33% */}

</div>

```



---



## 🚨 자주 하는 실수와 해결 방법



### 1. "Cannot find module" 에러



**원인:** 패키지가 설치되지 않음

```bash

npm install

```



### 2. "Port 5173 is already in use" 에러



**원인:** 포트가 이미 사용 중

```bash

# 프로세스 종료 후 다시 실행

# 또는 다른 포트 사용

npm run dev -- --port 3000

```



### 3. State가 변경되는데 화면이 안 바뀜



**잘못된 예:**

```tsx

const [items, setItems] = useState([1, 2, 3])

items.push(4) // ❌ 직접 수정하면 안 됨!

```



**올바른 예:**

```tsx

const [items, setItems] = useState([1, 2, 3])

setItems([...items, 4]) // ✅ 새 배열 생성

```



### 4. Props 타입 에러



```tsx

// ❌ 타입 정의 없음

function Button({ onClick }) {

    return <button onClick={onClick}>클릭</button>

}

 

// ✅ 타입 정의 있음

function Button({ onClick }: { onClick: () => void }) {

    return <button onClick={onClick}>클릭</button>

}

```



### 5. useEffect 무한 루프



```tsx

// ❌ 무한 루프

useEffect(() => {

    setData(fetchData())

}) // 의존성 배열 없음

 

// ✅ 올바른 사용

useEffect(() => {

    setData(fetchData())

}, []) // 빈 배열 = 한 번만 실행

```



### 6. Key prop 누락 (리스트 렌더링)



```tsx

// ❌ Key 없음

{items.map(item => <div>{item}</div>)}

 

// ✅ Key 있음

{items.map(item => <div key={item.id}>{item.name}</div>)}

```



---



## 📖 유용한 리소스



### 공식 문서

- [React 공식 문서 (한글)](https://ko.react.dev/)

- [TypeScript 공식 문서 (한글)](https://www.typescriptlang.org/ko/)

- [Vite 공식 문서](https://vitejs.dev/)

- [React Router 공식 문서](https://reactrouter.com/)

- [Tailwind CSS 공식 문서](https://tailwindcss.com/)



### 학습 자료

- [React 공식 튜토리얼](https://ko.react.dev/learn)

- [TypeScript Handbook](https://www.typescriptlang.org/ko/docs/handbook/intro.html)

- [MDN Web Docs (JavaScript)](https://developer.mozilla.org/ko/)



### 도구

- [React Developer Tools (Chrome 확장)](https://chrome.google.com/webstore/detail/react-developer-tools)

- [VS Code](https://code.visualstudio.com/) - 추천 에디터



### VS Code 추천 확장 프로그램

- **ES7+ React/Redux/React-Native snippets** - 코드 스니펫

- **Tailwind CSS IntelliSense** - Tailwind 자동완성

- **ESLint** - 코드 품질 체크

- **Prettier** - 코드 포매터

- **Auto Rename Tag** - HTML 태그 자동 수정



---



## 🎓 단계별 학습 가이드



### 1주차: React 기초

- [ ] 컴포넌트 만들기

- [ ] Props 사용하기

- [ ] State 사용하기 (useState)

- [ ] 이벤트 핸들링



### 2주차: React 심화

- [ ] useEffect 이해하기

- [ ] 조건부 렌더링

- [ ] 리스트 렌더링

- [ ] 폼 다루기



### 3주차: TypeScript & 라우팅

- [ ] TypeScript 기본 타입

- [ ] 인터페이스와 타입 정의

- [ ] React Router 사용법

- [ ] Link와 Navigate



### 4주차: 실전 개발

- [ ] API 호출 (fetch, axios)

- [ ] 커스텀 훅 만들기

- [ ] 상태 관리 패턴

- [ ] 성능 최적화 기초



---



## 🤝 개발 규칙



### 1. 파일명 규칙

- 컴포넌트: `PascalCase.tsx` (예: `Button.tsx`, `UserProfile.tsx`)

- 유틸/훅: `camelCase.ts` (예: `useAuth.ts`, `formatDate.ts`)

- 상수: `UPPER_CASE.ts` (예: `API_ENDPOINTS.ts`)



### 2. 컴포넌트 구조

```tsx

import { useState } from 'react'

import type { User } from './types'

 

// Props 타입 정의

interface UserCardProps {

    user: User

    onEdit: () => void

}

 

// 컴포넌트

export default function UserCard({ user, onEdit }: UserCardProps) {

    const [isHovered, setIsHovered] = useState(false)

 

    return (

        <div

            onMouseEnter={() => setIsHovered(true)}

            onMouseLeave={() => setIsHovered(false)}

        >

            <h2>{user.name}</h2>

            {isHovered && <button onClick={onEdit}>편집</button>}

        </div>

    )

}

```



### 3. Commit 메시지 규칙

```bash

feat: 새로운 기능 추가

fix: 버그 수정

docs: 문서 수정

style: 코드 포맷팅 (기능 변경 없음)

refactor: 코드 리팩토링

test: 테스트 코드

chore: 빌드, 패키지 등 기타 작업

 

# 예시

git commit -m "feat: 프로필 이미지 업로드 기능 추가"

git commit -m "fix: 로그인 후 리다이렉트 버그 수정"

```



---



## ❓ FAQ (자주 묻는 질문)



### Q1: npm과 npx의 차이는?

- **npm**: 패키지를 설치하고 관리하는 도구

- **npx**: 패키지를 일회성으로 실행하는 도구



### Q2: node_modules 폴더는 커밋하나요?

아니요! `.gitignore`에 포함되어 있어서 커밋되지 않습니다.



### Q3: package-lock.json은 무엇인가요?

정확한 패키지 버전을 기록하는 파일입니다. 커밋해야 합니다!



### Q4: 에러가 났을 때 어떻게 하나요?

1. 에러 메시지를 꼼꼼히 읽기

2. 콘솔에서 어느 파일의 몇 번째 줄인지 확인

3. 구글에 에러 메시지 검색

4. 팀원에게 질문하기



### Q5: 코드가 너무 복잡해 보여요

작은 컴포넌트로 쪼개세요! 한 컴포넌트는 한 가지 일만 하는 게 좋습니다.



---



## 🎉 마치며



React 개발이 처음에는 어려울 수 있지만, 하나씩 차근차근 배우다 보면 금방 익숙해집니다!



### 핵심 포인트

✅ 공식 문서를 자주 참고하세요

✅ 에러를 두려워하지 마세요 (에러는 배움의 기회!)

✅ 작은 기능부터 시작하세요

✅ 코드를 작성하고 브라우저에서 바로 확인하세요

✅ 다른 사람의 코드를 많이 읽어보세요



### 도움이 필요하면?

- 팀 슬랙/디스코드 채널에 질문하기

- GitHub Issues에 질문 올리기

- 공식 문서 읽기

- Stack Overflow 검색하기



**화이팅! 🚀**

