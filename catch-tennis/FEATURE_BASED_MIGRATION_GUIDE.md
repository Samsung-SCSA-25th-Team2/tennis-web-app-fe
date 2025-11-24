# Feature-Based Architecture Migration Guide

**Project:** Catch Tennis Web App
**Current Status:** 70% Complete
**Target:** Modern Feature-Slice Design (2024 Standards)

---

## Table of Contents

1. [Overview](#overview)
2. [Current Architecture Analysis](#current-architecture-analysis)
3. [Target Architecture](#target-architecture)
4. [Critical Issues to Fix](#critical-issues-to-fix)
5. [Step-by-Step Migration](#step-by-step-migration)
6. [Best Practices](#best-practices)
7. [Validation Checklist](#validation-checklist)

---

## Overview

This guide completes the migration from a traditional page-based React structure to a **Feature-Slice Design** architecture combined with **Atomic Design** for shared components.

### What is Feature-Based Architecture?

A modern architectural pattern where code is organized by **business features** (vertical slices) rather than technical layers (horizontal slices).

**Traditional (Before):**
```
src/
├── components/     # All components mixed together
├── pages/          # All pages
├── utils/          # All utilities
└── types/          # All types
```

**Feature-Based (After):**
```
src/
├── features/       # Business features (auth, match, chat)
│   └── match/
│       ├── components/   # Match-specific components
│       ├── pages/        # Match pages
│       ├── hooks/        # Match hooks
│       ├── utils/        # Match utilities
│       ├── common.ts      # Match types
│       └── index.ts      # Public API
└── shared/         # Truly shared/reusable code
    ├── components/ # Atomic design components
    ├── hooks/      # Generic hooks
    └── utils/      # Generic utilities
```

### Benefits

- **Scalability:** Features can be developed independently
- **Maintainability:** Related code is co-located
- **Team Collaboration:** Multiple teams can work on different features
- **Code Splitting:** Natural boundaries for lazy loading
- **Testing:** Easier to test features in isolation
- **Onboarding:** New developers can understand features independently

---

## Current Architecture Analysis

### ✅ Already Completed

1. **Feature Folders Created**
   - `features/auth/` - Authentication
   - `features/chat/` - Chat functionality
   - `features/club/` - Club management
   - `features/match/` - Match finding
   - `features/profile/` - User profiles

2. **Feature Structure Established**
   - Each feature has: `components/`, `pages/`, `utils/`, `index.ts`
   - Barrel exports implemented
   - Type files created

3. **Shared Layer Organized**
   - Atomic Design: `atoms/`, `molecules/`, `organisms/`
   - Layouts separated: `Header`, `Footer`, `MobileLayout`
   - Design system: `primitives/` and `semantics/` tokens

4. **Assets Organized**
   - Icons in `assets/icons/`
   - Images in `assets/images/`

### ❌ Critical Issues

1. **Broken Import:** `MatchCard.tsx` references deleted type files
2. **Dependency Rule Violation:** `shared/` component depends on `features/`
3. **Empty Files:** `shared/types/common.ts` is empty
4. **No Path Aliases:** Complex relative imports throughout
5. **API Hook Inefficiency:** Improper dependency array

### 🚧 Incomplete Areas

- Empty `components/` folders in: auth, chat, club
- Empty `utils/` folders in: auth, chat, club, match
- No `hooks/` folders in features (may be needed)
- No `api/` folders in features for feature-specific API calls

---

## Target Architecture

### Directory Structure

```
catch-tennis/
├── public/
├── src/
│   ├── app/                        # Application-level configuration
│   │   ├── App.tsx                 # Router setup
│   │   ├── main.tsx                # Entry point
│   │   └── providers/              # App-level providers
│   │
│   ├── features/                   # Feature modules (vertical slices)
│   │   ├── auth/
│   │   │   ├── api/                # Auth API calls
│   │   │   │   └── authApi.ts
│   │   │   ├── components/         # Auth-specific components
│   │   │   │   └── LoginButton.tsx
│   │   │   ├── hooks/              # Auth-specific hooks
│   │   │   │   └── useAuth.ts
│   │   │   ├── pages/
│   │   │   │   └── LoginCallback.tsx
│   │   │   ├── common.ts            # Auth types
│   │   │   ├── utils/              # Auth utilities
│   │   │   └── index.ts            # Public API
│   │   │
│   │   ├── chat/
│   │   │   ├── api/
│   │   │   ├── components/
│   │   │   │   ├── ChatMessage.tsx
│   │   │   │   └── ChatInput.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useChat.ts
│   │   │   ├── pages/
│   │   │   │   └── Chat.tsx
│   │   │   ├── common.ts
│   │   │   ├── utils/
│   │   │   └── index.ts
│   │   │
│   │   ├── club/
│   │   │   ├── api/
│   │   │   ├── components/
│   │   │   │   └── ClubCard.tsx
│   │   │   ├── hooks/
│   │   │   ├── pages/
│   │   │   │   └── Club.tsx
│   │   │   ├── common.ts
│   │   │   ├── utils/
│   │   │   └── index.ts
│   │   │
│   │   ├── match/
│   │   │   ├── api/
│   │   │   │   └── matchApi.ts
│   │   │   ├── components/
│   │   │   │   ├── FilterBar.tsx        ✅ Already here
│   │   │   │   ├── MatchList.tsx        ✅ Already here
│   │   │   │   └── MatchCard.tsx        ⚠️  Move from shared
│   │   │   ├── hooks/
│   │   │   │   └── useMatchSearch.ts
│   │   │   ├── pages/
│   │   │   │   └── Match.tsx            ✅ Already here
│   │   │   ├── common.ts                 ✅ Already here
│   │   │   ├── utils/
│   │   │   └── index.ts                 ✅ Already here
│   │   │
│   │   └── profile/
│   │       ├── api/
│   │       ├── components/
│   │       │   └── ProfileComplete.tsx  ✅ Already here
│   │       ├── hooks/
│   │       ├── pages/
│   │       │   ├── Profile.tsx          ✅ Already here
│   │       │   └── ProfileCompleteWrapper.tsx  ✅ Already here
│   │       ├── common.ts                 ✅ Already here
│   │       ├── utils/
│   │       │   ├── questions.ts         ✅ Already here
│   │       │   └── QAStorage.ts           ✅ Already here
│   │       └── index.ts                 ✅ Already here
│   │
│   ├── pages/                      # General routing pages (not feature-specific)
│   │   ├── HomePage.tsx
│   │   ├── ErrorPage.tsx
│   │   └── index.ts
│   │
│   ├── shared/                     # Truly shared/generic code
│   │   ├── api/
│   │   │   ├── client.ts           # Base API client
│   │   │   └── common.ts            # Common API types
│   │   │
│   │   ├── components/             # Generic, reusable components
│   │   │   ├── atoms/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── IconLoader.tsx
│   │   │   │   ├── ImgLoader.tsx
│   │   │   │   ├── InputText.tsx
│   │   │   │   └── index.ts
│   │   │   ├── molecules/
│   │   │   │   └── index.ts        ⚠️  Remove MatchCard
│   │   │   └── organisms/
│   │   │       ├── DateTimeSelector.tsx
│   │   │       └── index.ts
│   │   │
│   │   ├── hooks/
│   │   │   ├── useApi.ts           # Renamed from useApi.ts
│   │   │   ├── useDebounce.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── layouts/
│   │   │   ├── Footer.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── MobileLayout.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── styles/
│   │   │   ├── primitives/
│   │   │   │   ├── colors.css
│   │   │   │   ├── spacing.css
│   │   │   │   └── typography.css
│   │   │   └── semantics/
│   │   │       ├── colors.css
│   │   │       ├── layout.css
│   │   │       └── typography.css
│   │   │
│   │   ├── types/
│   │   │   ├── enums.ts            # Shared enums
│   │   │   ├── routes.ts           # Route types
│   │   │   └── common.ts           # Common types
│   │   │
│   │   └── utils/
│   │       ├── formatters.ts       # Date, number formatters
│   │       ├── validators.ts       # Generic validation
│   │       └── index.ts
│   │
│   ├── assets/
│   │   ├── icons/                  # SVG icons
│   │   └── images/                 # PNG/JPG images
│   │
│   └── index.css                   # Global styles
│
├── .env                            ⚠️  Move to root
├── package.json
├── vite.config.ts
└── tsconfig.json
```

### Feature Module Structure

Each feature follows this internal structure:

```
features/[feature-name]/
├── api/              # Feature-specific API calls
│   └── [feature]Api.ts
├── components/       # Components used ONLY by this feature
│   └── [Component].tsx
├── hooks/            # Hooks used ONLY by this feature
│   └── use[Hook].ts
├── pages/            # Route pages for this feature
│   └── [Page].tsx
├── utils/            # Utility functions for this feature
│   └── [utility].ts
├── common.ts          # TypeScript types/interfaces
├── constants.ts      # Feature-specific constants (optional)
└── index.ts          # Public API (barrel export)
```

### Dependency Rules

**Critical:** Follow these dependency rules to maintain architecture integrity:

```
┌─────────────┐
│   features  │  Can import from: shared, assets
│             │  Cannot import from: other features
└─────────────┘
      ↓
┌─────────────┐
│   shared    │  Can import from: assets
│             │  Cannot import from: features, pages
└─────────────┘
      ↓
┌─────────────┐
│   assets    │  Pure data, no imports
└─────────────┘
```

**Rules:**
1. Features are **independent** - they don't import from each other
2. Shared code is **generic** - no feature-specific logic
3. If a component is used by **2+ features** - it goes in `shared/`
4. If a component is used by **1 feature** - it stays in that feature
5. Communication between features happens through:
   - URL params (React Router)
   - Global state (if added)
   - Events (if needed)

---

## Critical Issues to Fix

### Issue 1: Broken Imports in MatchCard

**Location:** `src/shared/components/molecules/MatchCard.tsx`

**Problem:**
```typescript
import {type MatchInfo} from "../../types/matches.ts"  // ❌ File deleted
import {type CourtInfo} from "../../types/courts.ts"   // ❌ File deleted
```

**Solution:** Move MatchCard to match feature (it's match-specific anyway)

```bash
# Move file
mv src/shared/components/molecules/MatchCard.tsx \
   src/features/match/components/MatchCard.tsx

# Update imports in MatchCard.tsx
# Change:
import {type MatchInfo} from "../../types/matches.ts"
import {type CourtInfo} from "../../types/courts.ts"

# To:
import {type MatchInfo, type CourtInfo} from "../types"
```

**Update:** Remove MatchCard from shared molecules barrel export:

```typescript
// src/shared/components/molecules/index.ts
// Remove: export { default as MatchCard } from './MatchCard';
```

**Update:** Add MatchCard to match feature barrel export:

```typescript
// src/features/match/index.ts
export { default as MatchCard } from './components/MatchCard';
export { default as MatchList } from './components/MatchList';
export { default as FilterBar } from './components/FilterBar';
export { default as Match } from './pages/Match';
export * from './types';
```

### Issue 2: Add Path Aliases

**Location:** `tsconfig.json`

**Problem:** Imports like `../../../shared/components/atoms` are fragile

**Solution:** Add path aliases

```json
{
  "compilerOptions": {
    // ... existing options
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@features/*": ["./src/features/*"],
      "@shared/*": ["./src/shared/*"],
      "@assets/*": ["./src/assets/*"],
      "@pages/*": ["./src/pages/*"]
    }
  }
}
```

**Update Vite Config:** `vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), svgr(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@features': path.resolve(__dirname, './src/features'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@pages': path.resolve(__dirname, './src/pages'),
    },
  },
});
```

**Migrate Imports:**

```typescript
// Before:
import { Button } from '../../../shared/components/atoms';
import MatchIcon from '../../../assets/icons/match.svg?react';

// After:
import { Button } from '@shared/components/atoms';
import MatchIcon from '@assets/icons/match.svg?react';
```

### Issue 3: Fix API Hook Dependency Array

**Location:** `src/shared/hooks/useApi.ts`

**Problem:**
```typescript
}, [endpoint, JSON.stringify(options)])  // Creates new string every render
```

**Solution:** Use proper memoization or stable reference

```typescript
import { useEffect, useState, useRef } from "react";

interface GetApiOptions extends RequestInit {
  headers?: Record<string, string>;
}

export const useGetApi = <T>(endpoint: string, options?: GetApiOptions) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Use ref to track options changes properly
  const optionsRef = useRef<string>();
  const currentOptionsString = JSON.stringify(options);

  useEffect(() => {
    // Only fetch if options actually changed
    if (optionsRef.current === currentOptionsString && data !== null) {
      return;
    }

    optionsRef.current = currentOptionsString;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(endpoint, options);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, currentOptionsString]); // Now stable between renders

  return { data, loading, error };
};
```

**Better Solution:** Consider using a library like `react-query` or `swr` for data fetching.

### Issue 4: Move .env to Root

**Current:** `src/.env`
**Target:** `.env`

```bash
mv src/.env .env
```

**Update .gitignore** (if not already present):
```
.env
.env.local
.env.*.local
```

### Issue 5: Remove Empty Placeholder File

```bash
rm src/shared/types/common.ts
```

**Update:** Rename to something meaningful or remove exports:

```typescript
// src/shared/types/index.ts
export * from './enums';
export * from './routes';
export * from './common';  // If you add common types
```

---

## Step-by-Step Migration

### Phase 1: Fix Critical Issues (Do First)

#### Step 1.1: Move MatchCard to Match Feature

```bash
# Move the file
mv src/shared/components/molecules/MatchCard.tsx \
   src/features/match/components/MatchCard.tsx
```

**Update:** `src/features/match/components/MatchCard.tsx`
```typescript
// Change imports from:
import {type MatchInfo} from "../../types/matches.ts"
import {type CourtInfo} from "../../types/courts.ts"

// To:
import {type MatchInfo, type CourtInfo} from "../types"
```

**Update:** `src/shared/components/molecules/index.ts`
```typescript
// Remove this line:
// export { default as MatchCard } from './MatchCard';
```

**Update:** `src/features/match/index.ts`
```typescript
// Add:
export { default as MatchCard } from './components/MatchCard';
export { default as MatchList } from './components/MatchList';
export { default as FilterBar } from './components/FilterBar';
export { default as Match } from './pages/Match';
export * from './types';
```

**Update:** Any files importing MatchCard from shared:
```typescript
// Change from:
import { MatchCard } from '@shared/components/molecules';

// To:
import { MatchCard } from '@features/match';
```

#### Step 1.2: Add Path Aliases

**Update:** `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "types": ["vite/client", "vite-plugin-svgr/client"],

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,
    "verbatimModuleSyntax": true,

    /* Path Aliases - ADD THIS */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@features/*": ["./src/features/*"],
      "@shared/*": ["./src/shared/*"],
      "@assets/*": ["./src/assets/*"],
      "@pages/*": ["./src/pages/*"]
    }
  },
  "include": ["src"]
}
```

**Update:** `vite.config.ts`
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), svgr(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@features': path.resolve(__dirname, './src/features'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@pages': path.resolve(__dirname, './src/pages'),
    },
  },
});
```

#### Step 1.3: Update All Imports to Use Aliases

Use find and replace to update imports across the codebase:

**Pattern 1:** Shared components
```typescript
// Find: from ['"]\.\.\/.*?shared\/components
// Replace with: from '@shared/components
```

**Pattern 2:** Assets
```typescript
// Find: from ['"]\.\.\/.*?assets
// Replace with: from '@assets
```

**Pattern 3:** Features
```typescript
// Find: from ['"]\.\.\/.*?features\/([^'"]+)
// Replace with: from '@features/$1
```

**Example transformation:**
```typescript
// Before:
import { Button } from '../../../shared/components/atoms';
import MatchIcon from '../../../assets/icons/match.svg?react';
import { FilterBar } from '../../match/components/FilterBar';

// After:
import { Button } from '@shared/components/atoms';
import MatchIcon from '@assets/icons/match.svg?react';
import { FilterBar } from '@features/match';
```

#### Step 1.4: Fix API Hook

**Rename:** `src/shared/hooks/useApi.ts` → `src/shared/hooks/useApi.ts`

```bash
mv src/shared/hooks/useApi.ts src/shared/hooks/useApi.ts
```

**Update:** `src/shared/hooks/useApi.ts`
```typescript
import { useEffect, useState, useRef } from "react";

interface ApiOptions extends RequestInit {
  headers?: Record<string, string>;
}

export const useApi = <T>(endpoint: string, options?: ApiOptions) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Stable reference for options
  const optionsRef = useRef<string>();
  const currentOptionsString = JSON.stringify(options);

  useEffect(() => {
    // Skip if options haven't changed and we have data
    if (optionsRef.current === currentOptionsString && data !== null) {
      return;
    }

    optionsRef.current = currentOptionsString;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(endpoint, options);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, currentOptionsString]);

  return { data, loading, error };
};
```

**Create:** `src/shared/hooks/index.ts`
```typescript
export { useApi } from './useApi';
```

**Update imports:**
```typescript
// Change from:
import { useGetApi } from '@shared/hooks/api_hook';

// To:
import { useApi } from '@shared/hooks';
```

#### Step 1.5: Move .env to Root

```bash
mv src/.env .env
```

Verify environment variables still work after restart.

#### Step 1.6: Clean Up Empty Files

```bash
rm src/shared/types/common.ts
```

**Update:** `src/shared/types/index.ts` (create if doesn't exist)
```typescript
export * from './enums';
export * from './routes';
```

---

### Phase 2: Complete Feature Structure

#### Step 2.1: Add Missing Folders

Create standardized structure for all features:

```bash
# Auth feature
mkdir -p src/features/auth/api
mkdir -p src/features/auth/hooks

# Chat feature
mkdir -p src/features/chat/api
mkdir -p src/features/chat/hooks

# Club feature
mkdir -p src/features/club/api
mkdir -p src/features/club/hooks

# Match feature
mkdir -p src/features/match/api
mkdir -p src/features/match/hooks

# Profile feature
mkdir -p src/features/profile/api
mkdir -p src/features/profile/hooks
```

#### Step 2.2: Create Feature API Files

Each feature should manage its own API calls.

**Example:** `src/features/match/api/matchApi.ts`
```typescript
import { MatchInfo, MatchFilters } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export const matchApi = {
  /**
   * Search for matches based on filters
   */
  async searchMatches(filters: MatchFilters): Promise<MatchInfo[]> {
    const params = new URLSearchParams();

    if (filters.gameType) params.append('gameType', filters.gameType);
    if (filters.period) params.append('period', filters.period);
    if (filters.location) params.append('location', filters.location);

    const response = await fetch(
      `${API_BASE}/api/matches?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch matches: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Get match details by ID
   */
  async getMatchById(id: string): Promise<MatchInfo> {
    const response = await fetch(`${API_BASE}/api/matches/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch match: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Join a match
   */
  async joinMatch(matchId: string): Promise<void> {
    const response = await fetch(`${API_BASE}/api/matches/${matchId}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to join match: ${response.statusText}`);
    }
  },
};
```

**Create:** Similar API files for other features:
- `src/features/auth/api/authApi.ts`
- `src/features/chat/api/chatApi.ts`
- `src/features/club/api/clubApi.ts`
- `src/features/profile/api/profileApi.ts`

#### Step 2.3: Create Feature Hooks

**Example:** `src/features/match/hooks/useMatchSearch.ts`
```typescript
import { useState, useCallback } from 'react';
import { matchApi } from '../api/matchApi';
import { MatchInfo, MatchFilters } from '../types';

export const useMatchSearch = () => {
  const [matches, setMatches] = useState<MatchInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchMatches = useCallback(async (filters: MatchFilters) => {
    setLoading(true);
    setError(null);

    try {
      const results = await matchApi.searchMatches(filters);
      setMatches(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search matches');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    matches,
    loading,
    error,
    searchMatches,
  };
};
```

**Example:** `src/features/match/hooks/useMatchJoin.ts`
```typescript
import { useState, useCallback } from 'react';
import { matchApi } from '../api/matchApi';

export const useMatchJoin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const joinMatch = useCallback(async (matchId: string) => {
    setLoading(true);
    setError(null);

    try {
      await matchApi.joinMatch(matchId);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join match');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    joinMatch,
    loading,
    error,
  };
};
```

**Create:** `src/features/match/hooks/index.ts`
```typescript
export { useMatchSearch } from './useMatchSearch';
export { useMatchJoin } from './useMatchJoin';
```

#### Step 2.4: Update Feature Barrel Exports

Each feature's `index.ts` should export its public API:

**Example:** `src/features/match/index.ts`
```typescript
// Components
export { default as MatchCard } from './components/MatchCard';
export { default as MatchList } from './components/MatchList';
export { default as FilterBar } from './components/FilterBar';

// Pages
export { default as Match } from './pages/Match';

// Hooks
export * from './hooks';

// Types
export * from './types';

// Note: API functions are NOT exported - they're internal to the feature
// Components should use hooks instead of calling API directly
```

**Update all feature barrel exports:**
- `src/features/auth/index.ts`
- `src/features/chat/index.ts`
- `src/features/club/index.ts`
- `src/features/profile/index.ts`

---

### Phase 3: Refactor Components to Use Feature Hooks

#### Step 3.1: Refactor Match Page

**Before:** `src/features/match/pages/Match.tsx`
```typescript
// Using generic useGetApi hook directly
import { useGetApi } from '@shared/hooks/api_hook';

export default function Match() {
  const { data, loading, error } = useGetApi('/api/matches');

  // ... render logic
}
```

**After:** `src/features/match/pages/Match.tsx`
```typescript
import { useState } from 'react';
import { FilterBar, MatchList } from '@features/match';
import { useMatchSearch } from '../hooks';
import { MatchFilters } from '../types';

export default function Match() {
  const [filters, setFilters] = useState<MatchFilters>({});
  const { matches, loading, error, searchMatches } = useMatchSearch();

  const handleFilterChange = (newFilters: MatchFilters) => {
    setFilters(newFilters);
    searchMatches(newFilters);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="match-page">
      <FilterBar filters={filters} onFilterChange={handleFilterChange} />
      <MatchList matches={matches} loading={loading} />
    </div>
  );
}
```

#### Step 3.2: Apply Same Pattern to Other Features

Refactor each feature's page to use feature-specific hooks instead of generic API hooks.

---

### Phase 4: Shared Code Organization

#### Step 4.1: Create Shared Utilities

**Create:** `src/shared/utils/formatters.ts`
```typescript
/**
 * Format date for display
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format time for display
 */
export const formatTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format date and time together
 */
export const formatDateTime = (date: Date | string): string => {
  return `${formatDate(date)} ${formatTime(date)}`;
};
```

**Create:** `src/shared/utils/validators.ts`
```typescript
/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (Korean format)
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^01[0-9]-?[0-9]{4}-?[0-9]{4}$/;
  return phoneRegex.test(phone);
};
```

**Create:** `src/shared/utils/index.ts`
```typescript
export * from './formatters';
export * from './validators';
```

#### Step 4.2: Organize Shared Types

**Create:** `src/shared/types/common.ts`
```typescript
/**
 * Common API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

/**
 * Generic ID type
 */
export type ID = string | number;
```

**Update:** `src/shared/types/index.ts`
```typescript
export * from './common';
export * from './enums';
export * from './routes';
```

#### Step 4.3: Enhance Shared API Client

**Rename & Update:** `src/shared/api/api.ts` → `src/shared/api/client.ts`

```typescript
/**
 * Base API client configuration
 */
class ApiClient {
  private baseURL: string;
  private defaultHeaders: HeadersInit;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || '';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Generic GET request
   */
  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers: { ...this.defaultHeaders, ...options?.headers },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`GET ${endpoint} failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Generic POST request
   */
  async post<T, D = unknown>(
    endpoint: string,
    data?: D,
    options?: RequestInit
  ): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: { ...this.defaultHeaders, ...options?.headers },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    if (!response.ok) {
      throw new Error(`POST ${endpoint} failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Generic PUT request
   */
  async put<T, D = unknown>(
    endpoint: string,
    data?: D,
    options?: RequestInit
  ): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: { ...this.defaultHeaders, ...options?.headers },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    if (!response.ok) {
      throw new Error(`PUT ${endpoint} failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Generic DELETE request
   */
  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: { ...this.defaultHeaders, ...options?.headers },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`DELETE ${endpoint} failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Set authorization token
   */
  setAuthToken(token: string) {
    this.defaultHeaders = {
      ...this.defaultHeaders,
      Authorization: `Bearer ${token}`,
    };
  }

  /**
   * Clear authorization token
   */
  clearAuthToken() {
    const { Authorization, ...rest } = this.defaultHeaders as Record<string, string>;
    this.defaultHeaders = rest;
  }
}

export const apiClient = new ApiClient();
```

**Create:** `src/shared/api/common.ts`
```typescript
export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}
```

**Create:** `src/shared/api/index.ts`
```typescript
export { apiClient } from './client';
export type { ApiError } from './types';
```

**Update feature APIs to use this client:**

```typescript
// src/features/match/api/matchApi.ts
import { apiClient } from '@shared/api';
import { MatchInfo, MatchFilters } from '../types';

export const matchApi = {
  async searchMatches(filters: MatchFilters): Promise<MatchInfo[]> {
    const params = new URLSearchParams();

    if (filters.gameType) params.append('gameType', filters.gameType);
    if (filters.period) params.append('period', filters.period);
    if (filters.location) params.append('location', filters.location);

    return apiClient.get<MatchInfo[]>(`/api/matches?${params.toString()}`);
  },

  async getMatchById(id: string): Promise<MatchInfo> {
    return apiClient.get<MatchInfo>(`/api/matches/${id}`);
  },

  async joinMatch(matchId: string): Promise<void> {
    return apiClient.post(`/api/matches/${matchId}/join`);
  },
};
```

---

### Phase 5: Component Communication Patterns

#### Pattern 1: Feature-to-Feature Communication via URL

Features communicate through React Router:

```typescript
// In Match feature - navigate to profile
import { useNavigate } from 'react-router-dom';

function MatchCard({ match }) {
  const navigate = useNavigate();

  const handleUserClick = () => {
    // Navigate to profile feature with user ID
    navigate(`/profile/${match.creatorId}`);
  };

  return <div onClick={handleUserClick}>...</div>;
}
```

```typescript
// In Profile feature - read user ID from URL
import { useParams } from 'react-router-dom';

function Profile() {
  const { userId } = useParams();

  // Fetch user data based on userId
  // ...
}
```

#### Pattern 2: Shared State (If Needed)

If features need to share state (like authentication), create a context provider:

**Create:** `src/shared/contexts/AuthContext.tsx`
```typescript
import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (user: User) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

**Create:** `src/shared/contexts/index.ts`
```typescript
export { AuthProvider, useAuth } from './AuthContext';
```

**Update:** `src/App.tsx`
```typescript
import { AuthProvider } from '@shared/contexts';

function App() {
  return (
    <AuthProvider>
      {/* Router and other components */}
    </AuthProvider>
  );
}
```

**Usage in features:**
```typescript
// Any feature can now use auth
import { useAuth } from '@shared/contexts';

function SomeComponent() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return <div>Welcome {user.name}</div>;
}
```

---

## Best Practices

### 1. Feature Independence

**DO:**
```typescript
// features/match/components/MatchCard.tsx
import { Button } from '@shared/components/atoms';
import { useMatchJoin } from '../hooks';
import { MatchInfo } from '../types';

function MatchCard({ match }: { match: MatchInfo }) {
  const { joinMatch, loading } = useMatchJoin();

  return (
    <div>
      <Button onClick={() => joinMatch(match.id)} disabled={loading}>
        Join Match
      </Button>
    </div>
  );
}
```

**DON'T:**
```typescript
// features/match/components/MatchCard.tsx
import { ChatMessage } from '@features/chat';  // ❌ Feature importing another feature
```

### 2. Shared vs Feature Components

**Rule:** If a component is used by 2+ features OR is truly generic → `shared/`
If a component is used by 1 feature → stay in feature

**Examples:**

```typescript
// ✅ Shared - used everywhere
shared/components/atoms/Button.tsx

// ✅ Shared - used by match and club features
shared/components/organisms/DateTimeSelector.tsx

// ✅ Feature-specific - only used in match
features/match/components/MatchCard.tsx

// ❌ WRONG - MatchCard in shared but only used by match
shared/components/molecules/MatchCard.tsx
```

### 3. Type Organization

**Feature-specific types:**
```typescript
// features/match/common.ts
export interface MatchInfo {
  id: string;
  title: string;
  // ... match-specific fields
}

export interface MatchFilters {
  gameType?: string;
  period?: string;
  location?: string;
}
```

**Shared types:**
```typescript
// shared/types/common.ts
export interface ApiResponse<T> {
  data: T;
  success: boolean;
}

export type ID = string | number;
```

**Shared enums:**
```typescript
// shared/types/enums.ts
export enum GameType {
  SINGLES = 'SINGLES',
  DOUBLES = 'DOUBLES',
}
```

### 4. API Organization

Each feature manages its own API:

```typescript
// features/match/api/matchApi.ts
export const matchApi = {
  searchMatches: (filters) => { /* ... */ },
  getMatchById: (id) => { /* ... */ },
  joinMatch: (id) => { /* ... */ },
};

// features/chat/api/chatApi.ts
export const chatApi = {
  getMessages: (chatId) => { /* ... */ },
  sendMessage: (message) => { /* ... */ },
};
```

Generic API client in shared:

```typescript
// shared/api/client.ts
export const apiClient = {
  get: <T>(endpoint) => { /* ... */ },
  post: <T>(endpoint, data) => { /* ... */ },
  // ...
};
```

### 5. Hook Patterns

**Feature hook using shared hook:**
```typescript
// features/match/hooks/useMatchSearch.ts
import { useApi } from '@shared/hooks';  // Generic hook
import { matchApi } from '../api/matchApi';

export const useMatchSearch = () => {
  // Feature-specific logic using shared utilities
  const { data, loading, error } = useApi(matchApi.searchMatches);

  return { matches: data, loading, error };
};
```

### 6. Import Order

Consistent import organization:

```typescript
// 1. React imports
import { useState, useEffect } from 'react';

// 2. Third-party imports
import { useNavigate } from 'react-router-dom';

// 3. Shared imports (absolute paths)
import { Button } from '@shared/components/atoms';
import { useAuth } from '@shared/contexts';

// 4. Feature imports (absolute paths from other features)
// (Avoid if possible - features should be independent)

// 5. Local imports (relative paths within same feature)
import { useMatchSearch } from '../hooks';
import { MatchInfo } from '../types';
import { MatchCard } from './MatchCard';

// 6. Assets
import MatchIcon from '@assets/icons/match.svg?react';

// 7. Styles (if CSS modules)
import styles from './Match.module.css';
```

### 7. Naming Conventions

**Files:**
- Components: PascalCase - `MatchCard.tsx`
- Hooks: camelCase with 'use' prefix - `useMatchSearch.ts`
- Utilities: camelCase - `formatters.ts`
- Types: camelCase - `common.ts`
- API: camelCase with 'Api' suffix - `matchApi.ts`

**Exports:**
- Components: default export + named type exports
- Hooks: named exports
- Utils: named exports
- Types: named exports
- API: named object export

### 8. Folder Structure Rules

**DO create:**
- `api/` - when feature has 2+ API endpoints
- `hooks/` - when feature has custom hooks
- `utils/` - when feature has utility functions
- `common.ts` - when feature has 2+ type definitions
- `constants.ts` - when feature has constants

**DON'T create:**
- Empty folders just for consistency
- Overly nested folders (max 2-3 levels deep in a feature)
- `helpers/`, `lib/`, `services/` - use `utils/` instead

---

## Validation Checklist

After completing migration, verify:

### Architecture

- [ ] All features are in `src/features/`
- [ ] Each feature has: `components/`, `pages/`, `index.ts`
- [ ] No feature imports from another feature
- [ ] Shared components are truly generic
- [ ] Path aliases configured and working

### Imports

- [ ] No relative imports crossing feature boundaries
- [ ] All imports use path aliases (`@shared`, `@features`, etc.)
- [ ] No circular dependencies
- [ ] Import order is consistent

### Types

- [ ] Feature-specific types in feature `common.ts`
- [ ] Shared types in `shared/types/`
- [ ] No duplicate type definitions
- [ ] All types are exported properly

### API Layer

- [ ] Each feature has `api/` folder if needed
- [ ] Feature APIs use shared `apiClient`
- [ ] No direct fetch calls in components
- [ ] API functions are properly typed

### Hooks

- [ ] Custom hooks follow `use` prefix convention
- [ ] Feature hooks in feature `hooks/` folder
- [ ] Shared hooks in `shared/hooks/`
- [ ] No dependency array issues

### Components

- [ ] Components use feature hooks, not direct API calls
- [ ] Proper separation of concerns
- [ ] No business logic in presentation components
- [ ] Consistent naming and structure

### Build & Runtime

- [ ] `npm run dev` works without errors
- [ ] `npm run build` succeeds
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] All routes work correctly
- [ ] Hot reload works

### Code Quality

- [ ] No console errors/warnings
- [ ] No unused imports
- [ ] No commented-out code
- [ ] Consistent formatting
- [ ] Proper error handling

---

## Testing the Migration

### Step 1: Build Test

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Build
npm run build
```

Should complete without errors.

### Step 2: Development Server

```bash
npm run dev
```

Visit each route:
- `/` - Home page
- `/match` - Match search
- `/chat` - Chat
- `/club` - Club
- `/profile` - Profile
- `/login-callback` - Login callback

Verify no console errors.

### Step 3: TypeScript Check

```bash
npx tsc --noEmit
```

Should show no type errors.

### Step 4: Lint Check

```bash
npm run lint
```

Should pass all linting rules.

### Step 5: Import Validation

Search codebase for problematic patterns:

```bash
# Find relative imports crossing boundaries
grep -r "from ['\"]\.\.\/\.\.\/" src/features/

# Find feature-to-feature imports (should be none)
grep -r "from ['\"].*features\/" src/features/ | grep -v "index.ts"
```

---

## Common Migration Pitfalls

### Pitfall 1: Circular Dependencies

**Problem:**
```typescript
// features/match/index.ts
export * from './components/MatchCard';

// features/match/components/MatchCard.tsx
import { MatchFilters } from '@features/match';  // Circular!
```

**Solution:**
```typescript
// features/match/components/MatchCard.tsx
import { MatchFilters } from '../types';  // Use relative imports within feature
```

### Pitfall 2: Shared Depending on Features

**Problem:**
```typescript
// shared/components/molecules/MatchCard.tsx
import { MatchInfo } from '@features/match/types';  // ❌ Shared can't depend on features
```

**Solution:** Move component to feature or extract interface to shared

```typescript
// Option 1: Move to feature
// features/match/components/MatchCard.tsx

// Option 2: Extract interface
// shared/types/common.ts
export interface CardData {
  id: string;
  title: string;
}

// shared/components/molecules/GenericCard.tsx
import { CardData } from '@shared/types';

// features/match/common.ts
import { CardData } from '@shared/types';
export interface MatchInfo extends CardData {
  // match-specific fields
}
```

### Pitfall 3: Over-Abstraction

**Problem:**
```typescript
// Creating abstractions too early
shared/components/atoms/SportCard.tsx  // Only used by match
shared/components/atoms/TennisButton.tsx  // Only used by match
```

**Solution:** Keep in feature until actually reused

```typescript
// Start here
features/match/components/MatchCard.tsx

// Move to shared ONLY when chat or club also need it
```

### Pitfall 4: Barrel Export Bloat

**Problem:**
```typescript
// features/match/index.ts
export * from './components/MatchCard';
export * from './components/FilterBar';
export * from './components/MatchList';
export * from './components/MatchHeader';
export * from './components/MatchFooter';
// ... 20 more components
```

**Solution:** Only export what's needed outside the feature

```typescript
// features/match/index.ts
// Public API - only components used by other parts of app
export { default as Match } from './pages/Match';
export { useMatchSearch, useMatchJoin } from './hooks';
export type { MatchInfo, MatchFilters } from './types';

// Internal components (MatchCard, FilterBar, etc.) are NOT exported
// They're used only within the feature
```

### Pitfall 5: Forgetting to Update Imports

After moving files, search for old import paths:

```bash
# Find old imports
grep -r "from ['\"].*pages/Match" src/
grep -r "from ['\"].*profileComplete" src/
```

---

## Maintenance Guidelines

### Adding a New Feature

1. Create feature folder structure:
```bash
mkdir -p src/features/new-feature/{api,components,hooks,pages,utils}
```

2. Create files:
```bash
touch src/features/new-feature/common.ts
touch src/features/new-feature/index.ts
```

3. Follow the pattern:
```typescript
// src/features/new-feature/index.ts
export { default as NewFeaturePage } from './pages/NewFeaturePage';
export * from './hooks';
export * from './types';
```

4. Add route in `App.tsx`

### Adding a Component

**Decision tree:**

```
Is it used by 2+ features?
├─ Yes → put in shared/components/
└─ No → put in features/[feature-name]/components/

Is it generic (Button, Input, Card)?
├─ Yes → put in shared/components/atoms/
└─ No → put in feature

Does it combine multiple atoms?
├─ Yes → shared/components/molecules/ or organisms/
└─ No → shared/components/atoms/
```

### Adding a Hook

```
Does it fetch data specific to one feature?
├─ Yes → features/[feature-name]/hooks/
└─ No → shared/hooks/

Is it generic (useDebounce, useLocalStorage)?
├─ Yes → shared/hooks/
└─ No → feature hook
```

### Adding a Utility

```
Is it feature-specific?
├─ Yes → features/[feature-name]/utils/
└─ No → shared/utils/

Is it generic (date formatting, validation)?
├─ Yes → shared/utils/
└─ No → feature utility
```

---

## Future Enhancements

### 1. Add State Management

When app grows, consider Zustand:

```bash
npm install zustand
```

```typescript
// src/shared/stores/authStore.ts
import { create } from 'zustand';

interface AuthStore {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
```

### 2. Add Testing

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

Follow feature structure:
```
features/match/
├── components/
│   ├── MatchCard.tsx
│   └── MatchCard.test.tsx
├── hooks/
│   ├── useMatchSearch.ts
│   └── useMatchSearch.test.ts
```

### 3. Add API Layer Enhancement

Consider React Query for better data fetching:

```bash
npm install @tanstack/react-query
```

### 4. Add Error Boundaries

```typescript
// shared/components/ErrorBoundary.tsx
import { Component, ReactNode } from 'react';

export class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
```

### 5. Add Storybook

```bash
npx storybook@latest init
```

Create stories for shared components:
```typescript
// shared/components/atoms/Button.stories.tsx
```

---

## Conclusion

This migration guide provides a complete roadmap from your current 70%-complete feature-based structure to a fully realized modern architecture.

**Key Takeaways:**

1. **Your foundation is solid** - feature folders and structure are in place
2. **Fix critical issues first** - broken imports and dependency violations
3. **Add path aliases** - dramatically improves developer experience
4. **Complete the structure** - add API/hooks folders where needed
5. **Follow dependency rules** - features independent, shared generic
6. **Use barrel exports wisely** - only export public API
7. **Consistent patterns** - easier to maintain and scale

**Next Steps:**

1. Fix critical issues (Phase 1)
2. Add path aliases
3. Complete feature structure
4. Refactor components to use feature hooks
5. Validate and test
6. Document patterns for team

This architecture will scale well as your application grows and make onboarding new developers much easier.

Good luck with the migration!
