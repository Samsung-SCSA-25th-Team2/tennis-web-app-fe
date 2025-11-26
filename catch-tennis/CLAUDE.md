# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Running the Application
```bash
npm run dev          # Start dev server with network access (--host flag)
npm run build        # TypeScript compile + production build
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Environment Setup
- Backend API URL is configured via `.env` file: `VITE_API_BASE_URL`
- Default backend: `http://localhost:8888`
- Authentication uses JWT tokens stored in `localStorage` under `accessToken`

## Architecture Overview

### Feature-Based Architecture
This codebase uses a feature-based architecture where code is organized by feature domains rather than technical layers. Each feature is a vertical slice containing its own pages, components, API layer, hooks, types, and utilities.

**Feature Structure:**
```
src/features/{feature-name}/
├── index.ts              # Public API exports (pages, hooks, types)
├── common.ts             # Feature-specific types and constants
├── pages/                # Route components
├── components/           # Feature-specific UI components
├── api/                  # API client functions
├── hooks/                # Feature-specific React hooks
├── services/             # Business logic (e.g., WebSocket service)
└── utils/                # Feature-specific utilities
```

**Current Features:**
- `match` - Tennis match search, creation, and details
- `profile` - User profiles and profile completion flow
- `chat` - Real-time chat using STOMP WebSocket
- `auth` - OAuth2/Kakao authentication
- `club` - Tennis club functionality (minimal implementation)

### Shared Layer
Shared code lives in `src/shared/` and provides generic, reusable functionality:

```
src/shared/
├── api/                  # Generic API client (fetch wrapper)
├── components/           # Reusable UI components (atoms, molecules, organisms)
│   ├── atoms/           # Basic components (Button, InputText, DatePicker)
│   ├── molecules/       # Composite components
│   ├── organisms/       # Complex components
│   └── ui/              # shadcn/ui components
├── hooks/               # Generic hooks (useGetApi)
├── layouts/             # Layout components (MobileLayout, Header, Footer)
├── lib/                 # Utilities (e.g., tailwind cn utility)
├── styles/              # Global styles (primitives, semantics)
├── types/               # Shared types and enums
└── utils/               # Generic utilities
```

### Import Aliases
TypeScript path aliases are configured in `tsconfig.app.json`:
- `@/*` - Root src directory
- `@features/*` - Feature modules
- `@shared/*` - Shared code
- `@assets/*` - Static assets
- `@pages/*` - Top-level pages (Home, Error, NotFound)

shadcn/ui aliases are configured in `components.json`:
- `@/shared/components` - Components directory
- `@/shared/lib/utils` - Utils for shadcn components
- `@/shared/hooks` - Hooks directory

### Routing
React Router v7 with data router (createBrowserRouter):
- Routes defined in `src/App.tsx`
- Layout wrapper: `MobileLayout` provides Header/Footer
- Route handles control Header/Footer visibility via `RouteHandle` type
- Dynamic routes use params: `/match/:matchId`, `/chat/:roomId`, `/profile/:userId`

## Key Patterns and Conventions

### API Layer Pattern
**Generic API Client** (`src/shared/api/api.ts`):
- Provides `api.get()`, `api.post()`, `api.put()`, `api.patch()`, `api.delete()`
- Handles JWT tokens via `useJWT: true` option
- Supports query params via `params` option
- Base URL from environment: `VITE_API_BASE_URL + '/api'`

**Generic Hook** (`src/shared/hooks/useApi.ts`):
- `useGetApi<T>(endpoint, optionsString)` - Returns `{data, loading, error}`
- **Note:** Currently accepts pre-stringified options (see TODO.md Priority 1 #1)

**Feature API Layers** (partially implemented):
- Some features like `chat` and `profile` have dedicated `api/` directories
- Example: `features/chat/api/chatApi.ts` exports typed API functions
- Pattern: Export functions like `getChatRooms()`, `getChatMessages(roomId)`

### WebSocket for Real-Time Chat
The chat feature uses STOMP over SockJS:
- Service: `features/chat/services/websocket.ts`
- Singleton pattern: `getChatWebSocketService()`
- Connection includes JWT token in headers
- Subscribe to rooms: `/topic/chatroom.{roomId}`
- Send messages: `/app/chat.send`

### Component Organization
Components follow Atomic Design principles:
- **Atoms**: Basic building blocks (Button, InputText, DatePicker, IconLoader, ImgLoader)
- **Molecules**: Combinations of atoms
- **Organisms**: Complex, feature-specific components
- **ui/**: shadcn/ui components (use `npx shadcn@latest add <component>`)

### Type System
- Shared types in `src/shared/types/`
  - `enums.ts` - Application enums (GameType, Gender, Period, etc.)
  - `routes.ts` - Router types (RouteHandle)
  - `common.ts` - Common interfaces (UserStatus, ProfileData, TimeRange, API URLs)
- Feature types in `{feature}/common.ts`
- Export types from feature barrel exports (`index.ts`) using `export type { ... }`

### Styling
- **Tailwind CSS v4** with CSS variables
- Theme config: `components.json` (shadcn/ui integration)
- Custom styles: `src/shared/styles/`
  - `primitives/` - Design tokens
  - `semantics/` - Semantic color/spacing variables
- Global CSS: `src/index.css`

## Important Implementation Notes

### Authentication Flow
1. User redirects to backend OAuth2 endpoint: `{API_BASE_URL}/oauth2/authorization/kakao`
2. Backend handles OAuth and redirects to `/auth/callback?token=...`
3. Frontend extracts token and stores in `localStorage.accessToken`
4. Subsequent API calls include token via `useJWT: true` option

### Profile Completion Flow
Multi-step form at `/profile-complete/:questionNumber`:
- Questions defined in `features/profile/utils/questions.ts`
- Uses localStorage to cache form data during flow
- Redirects to `/profile-complete/1` by default
- Storage utilities in `features/profile/utils/storage.ts`

### Date/Time Handling
- Uses `date-fns` library for date manipulation
- Custom components: `DatePicker`, `TimePicker` in `shared/components/atoms/`
- Uses `react-day-picker` for calendar UI

### Loading and Error States
Components use `ImgLoader` component for loading/error states:
```tsx
if (loading) return <ImgLoader imgType="loading" imgSize="full" />
if (error) return <ImgLoader imgType="error" imgSize="full" />
```

## Known Issues and TODOs

See `TODO.md` for detailed architectural improvements needed. Key issues:

1. **API Hook Design**: `useGetApi` requires pre-stringified options (`JSON.stringify()`), should accept objects
2. **Feature API Layers**: Not all features have dedicated API layers; some components call `useGetApi` directly with hardcoded endpoints
3. **Missing Type Safety**: Some props use `string` instead of proper enum types (e.g., `gameType: string` instead of `gameType: GameType`)
4. **No Request Cancellation**: `useGetApi` doesn't cancel in-flight requests on unmount/re-fetch
5. **No Error Boundaries**: App lacks error boundaries for graceful error handling

See `FEATURE_BASED_MIGRATION_GUIDE.md` for migration strategy from component-based to feature-based architecture.
See `SHADCN_MIGRATION_GUIDE.md` for shadcn/ui component migration details.

## Tech Stack
- **React 19** with TypeScript
- **React Router v7** (data router)
- **Vite 7** (build tool)
- **Tailwind CSS v4** (styling)
- **shadcn/ui** (component library, New York style)
- **Radix UI** (headless primitives for dropdowns, popovers, sliders)
- **date-fns** (date utilities)
- **STOMP.js + SockJS** (WebSocket for chat)
- **Lucide React** (icons)

## Build Configuration
- **Vite Plugins**:
  - `@vitejs/plugin-react` - React Fast Refresh
  - `@tailwindcss/vite` - Tailwind CSS v4 integration
  - `vite-plugin-svgr` - Import SVGs as React components
  - `vite-tsconfig-paths` - Enable TypeScript path aliases in Vite
- **TypeScript**: Strict mode enabled with `noUnusedLocals` and `noUnusedParameters`
- **ESLint**: React hooks and refresh plugins configured
