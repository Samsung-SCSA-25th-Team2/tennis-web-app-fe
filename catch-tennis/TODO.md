# Feature-Based Architecture TODO

**Status:** 75% Complete - Architecture is solid, needs refinement

---

## Priority 1: Critical Architecture Issues

### 1. Fix `useGetApi` Hook API Design

**Current Problem:**
```typescript
// src/shared/hooks/useApi.ts
export function useGetApi<T>(endpoint: string, optionsString = "")

// Forces awkward usage:
const {data} = useGetApi<MatchListResult>('/v1/matches', JSON.stringify(options))
```

**Why This Is Bad:**
- Violates principle of least surprise - TypeScript functions should accept typed objects, not pre-stringified JSON
- Forces every caller to remember to call `JSON.stringify()`
- Makes the hook harder to test and mock
- Breaks type safety since `optionsString` is just a string
- The dependency array issue still exists: `[endpoint, optionsString]` will trigger re-fetch even when options semantically haven't changed

**Why It Matters:**
This is a shared hook used across all features. Poor API design here multiplies across the entire codebase and makes feature development more error-prone.

**Impact:** High - Affects all features using data fetching

---

### 2. Add Feature-Specific API Layers

**Current Problem:**
Components directly call generic hooks with hardcoded endpoints:
```typescript
// features/match/components/MatchCard.tsx
const {data} = useGetApi<CourtInfo>(`/v1/tennis-courts/${matchInfo.courtId}`)

// features/match/components/MatchList.tsx
const {data} = useGetApi<MatchListResult>('/v1/matches', JSON.stringify(options))
```

**Why This Is Bad:**
- **Violates Feature Encapsulation**: API endpoints are scattered throughout components instead of centralized
- **Hard to Change**: If API endpoint changes, must find/replace across all components
- **Hard to Test**: Can't mock API calls at feature level, must mock generic hook
- **No Request/Response Transformation**: Can't normalize API responses before they reach components
- **Duplicated Logic**: Same endpoint might be called from multiple components with slightly different params

**Why It Matters:**
In feature-based architecture, each feature should own its data fetching logic. When you need to:
- Switch from REST to GraphQL
- Add caching or request deduplication
- Transform API responses to match component needs
- Add retry logic or error handling

You want to change it in ONE place per feature, not hunt through every component.

**Expected Pattern:**
```typescript
// features/match/api/matchApi.ts - Single source of truth for match API
export const matchApi = {
  searchMatches: (filters: MatchFilters) => api.get<MatchListResult>('/v1/matches', {params: filters}),
  getCourtById: (courtId: number) => api.get<CourtInfo>(`/v1/tennis-courts/${courtId}`),
}

// features/match/hooks/useMatchSearch.ts - Feature-specific hook
export const useMatchSearch = (filters: MatchFilters) => {
  // Uses matchApi internally, adds feature-specific logic
}

// features/match/components/MatchList.tsx - Clean component
const {matches, loading} = useMatchSearch(filters) // No endpoints, no API details
```

**Impact:** High - Core architectural principle

---

### 3. Create Feature-Specific Hooks

**Current Problem:**
Components use generic `useGetApi` hook directly, mixing data fetching concerns with UI logic.

**Why This Is Bad:**
- **Poor Separation of Concerns**: Components know about API endpoints and response shapes
- **Reduces Reusability**: Same data fetching logic duplicated across components
- **Hard to Add Business Logic**: Where do you put pagination? Filtering? Caching?
- **Difficult Testing**: Must mock generic hook instead of feature-specific behavior
- **Breaks Feature Independence**: Components depend on shared infrastructure instead of feature's public API

**Why It Matters:**
Feature-based architecture works best when each feature provides a clean hook API that hides implementation details. Compare:

```typescript
// ❌ Current - Component knows too much
function MatchList() {
  const {data, loading, error} = useGetApi<MatchListResult>('/v1/matches', JSON.stringify(options))
  // Component handles loading state, error handling, data transformation...
}

// ✅ Better - Feature hook handles concerns
function MatchList() {
  const {matches, loading, error, refetch} = useMatchSearch(filters)
  // Component just renders - all data concerns in the hook
}
```

When you need to:
- Add optimistic updates
- Implement infinite scroll
- Add real-time updates via WebSocket
- Cache responses in localStorage

You change the hook once, not every component.

**Impact:** High - Affects maintainability and testability

---

## Priority 2: Type System Improvements

### 4. Export Feature Types from Barrel Exports

**Current Problem:**
```typescript
// features/match/index.ts - Only exports page
export { Match as MatchPage } from './pages/Match.tsx'

// features/match/common.ts - Types exist but not exported
export interface MatchInfo { ... }
export interface CourtInfo { ... }
```

**Why This Is Bad:**
- **Unclear Public API**: No way to know what types are meant to be public vs internal
- **Forces Relative Imports**: Other parts of app must use `../../../features/match/common.ts`
- **Breaks Encapsulation**: Imports bypass the feature's intended interface

**Why It Matters:**
Barrel exports (`index.ts`) define your feature's **public API contract**. Without exporting types:
- You can't enforce which types are public vs private
- Refactoring internal types becomes risky (are they used externally?)
- IDE autocomplete doesn't help discover available types
- No single place to see what a feature provides

**Expected Pattern:**
```typescript
// features/match/index.ts
export { Match as MatchPage } from './pages/Match'
export type { MatchInfo, CourtInfo, MatchFilters, SortType, StatusType } from './common'
export { useMatchSearch, useCourtDetails } from './hooks'
```

This makes it clear:
- What components does this feature expose? (MatchPage)
- What types can I use? (MatchInfo, CourtInfo, etc.)
- What hooks are available? (useMatchSearch, useCourtDetails)

**Impact:** Medium - Improves developer experience and API clarity

---

### 5. Use Proper Types Instead of Inline Definitions

**Current Problem:**
```typescript
// features/match/components/MatchList.tsx
interface MatchListProps extends HTMLAttributes<HTMLDivElement> {
    // TODO: use types
    gameType: string      // Should be GameType enum
    sortType: string      // Should be SortType
    startDatetime: Date
    endDatetime: Date
    status: string        // Should be StatusType
}
```

**Why This Is Bad:**
- **Lost Type Safety**: `string` accepts any value, defeats purpose of TypeScript
- **No Autocomplete**: IDE can't suggest valid values
- **Runtime Errors**: Invalid values only caught at runtime, not compile time
- **Duplicate Definitions**: Same concept defined differently in different files
- **Self-Documenting Code Lost**: Types encode business rules, strings don't

**Why It Matters:**
TypeScript's value comes from **narrowing types** to match domain concepts:

```typescript
// ❌ Current - accepts any string
gameType: string  // Could be "foo", "bar", anything
status: string    // Could be "INVALID", "xyz", etc.

// ✅ With proper types
gameType: GameType           // Only: SINGLES, DOUBLES, MIXED_DOUBLES
status: StatusType           // Only: RECRUITING, COMPLETED, ALL
sortType: SortType           // Only: latest, loc5, loc10, etc.
```

Benefits:
- **Catch errors at compile time** instead of production
- **Refactoring is safe** - TypeScript finds all usages
- **Self-documenting** - Types show what values are valid
- **Better IDE support** - Autocomplete, go-to-definition

**Impact:** Medium - Type safety prevents bugs

---

### 6. Populate or Remove `shared/types/common.ts`

**Current Problem:**
File exists but is empty (only 1 line).

**Why This Is Bad:**
- **Dead Code**: Empty files clutter the codebase
- **Unclear Intent**: Is this placeholder or intentionally empty?
- **Import Confusion**: `shared/types/index.ts` might try to export from it

**Why It Matters:**
Clean codebases don't have placeholder files. Either:

**Option A: Populate with common types**
```typescript
// shared/types/common.ts
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

export interface PaginationMeta {
  page: number
  pageSize: number
  total: number
}

export type ID = string | number
```

**Option B: Remove it**
If no shared types needed, delete the file and remove from `shared/types/index.ts`.

**Impact:** Low - Code cleanliness

---

## Priority 3: Code Quality & Patterns

### 7. Remove Debug Console Logs

**Current Problem:**
Production code has console.logs everywhere:
```typescript
// features/match/components/MatchCard.tsx
console.log(matchInfo)
console.log(rest)
console.log(`${JSON.stringify(data)} ${loading} ${error}`)

// features/match/components/MatchList.tsx
console.log(`MatchList: ${gameType}, ${sortType}...`)
console.log(`${data} ${loading} ${error}`)

// features/match/pages/Match.tsx
console.log(`Match: ${setGameType} ${setSortType}...`)
```

**Why This Is Bad:**
- **Performance**: Console logs in React render paths can cause performance issues
- **Security**: May leak sensitive data to browser console
- **Production Noise**: Clutters console making real debugging harder
- **Unprofessional**: Ships debug code to production

**Why It Matters:**
Console logs are for development debugging, not production code. They should be:
- Removed before commit, OR
- Wrapped in environment checks (`if (import.meta.env.DEV)`), OR
- Replaced with proper logging library

Also note: Match.tsx logs the **setter functions** instead of values:
```typescript
console.log(`Match: ${setGameType} ${setSortType}...`)
// Outputs: "Match: function setGameType() function setSortType()..."
```

This suggests the logs were added during debugging and forgotten.

**Impact:** Low - Code quality issue

---

### 8. Fix Unused Variable Warnings

**Current Problem:**
Match.tsx defines state setters but never uses them:
```typescript
const [gameType, setGameType] = useState<GameType>(GameType.MixedDoubles)
const [sortType, setSortType] = useState<SortType>('latest')
// ... setters are defined but never called
```

**Why This Is Bad:**
- **Incomplete Feature**: Suggests filtering functionality isn't implemented
- **Dead Code**: Variables that aren't used should be removed
- **Maintenance Burden**: Future developers don't know if this is intentional
- **Linting Noise**: TypeScript/ESLint will warn about unused variables

**Why It Matters:**
Looking at the code, FilterBar doesn't accept props and Match page doesn't pass handlers:
```typescript
// Match.tsx
<FilterBar />  // No props - can't update state
```

This indicates one of two scenarios:
1. **Work in Progress**: Filtering UI exists but isn't wired up yet
2. **Dead Code**: State was added but feature was never completed

Either way, should be resolved:
- Wire up the state to FilterBar, OR
- Remove unused state until feature is implemented

**Impact:** Low - Code cleanliness

---

### 9. Replace Magic Numbers with Named Constants

**Current Problem:**
```typescript
// features/match/pages/Match.tsx
const [startDatetime, setStartDatetime] = useState<Date>(new Date(1763686800000))
const [endDatetime, setEndDatetime] = useState<Date>(new Date(1793478550000))
```

**Why This Is Bad:**
- **Unreadable**: What do these timestamps represent?
  - 1763686800000 = Dec 11, 2025
  - 1793478550000 = Jul 14, 2026
- **Unmaintainable**: Can't understand intent without converting to dates
- **Error-Prone**: Easy to mistype or use wrong value

**Why It Matters:**
Code should be self-documenting. Compare:

```typescript
// ❌ Current - what are these?
const [startDatetime] = useState(new Date(1763686800000))

// ✅ Better - clear intent
const DEFAULT_START_DATE = new Date('2025-12-11')
const DEFAULT_END_DATE = new Date('2026-07-14')
const [startDatetime] = useState(DEFAULT_START_DATE)

// ✅ Or if these are "now + 1 month" and "now + 1 year"
const [startDatetime] = useState(addMonths(new Date(), 1))
const [endDatetime] = useState(addYears(new Date(), 1))
```

**Impact:** Low - Code readability

---

## Priority 4: Missing Infrastructure

### 10. Add Error Boundaries

**Current Problem:**
No error boundaries in the app. If a component throws an error, the entire app crashes with white screen.

**Why This Is Bad:**
- **Poor User Experience**: Single component error crashes entire app
- **No Error Recovery**: Can't show fallback UI or retry
- **No Error Reporting**: Errors disappear without logging
- **Violates Resilience Principle**: Features should fail independently

**Why It Matters:**
React Error Boundaries let you:
- Catch errors in component tree
- Display fallback UI instead of crashing
- Log errors for debugging
- Recover gracefully

**Expected Pattern:**
```typescript
// shared/components/ErrorBoundary.tsx
class ErrorBoundary extends Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />
    }
    return this.props.children
  }
}

// App.tsx - Wrap routes
<ErrorBoundary>
  <RouterProvider router={router} />
</ErrorBoundary>
```

For feature-based architecture, you might also wrap individual features:
```typescript
<ErrorBoundary fallback={<FeatureError feature="match" />}>
  <MatchPage />
</ErrorBoundary>
```

This way, if Match feature crashes, the rest of the app (header, footer, other features) continues working.

**Impact:** Medium - Production resilience

---

### 11. Add Loading States to Shared Components

**Current Problem:**
Every component reimplements loading state handling:
```typescript
// Pattern repeated in multiple places
if (loading) return <ImgLoader imgType={'loading'} imgSize={'full'}/>
if (error) return <ImgLoader imgType={'error'} imgSize={'full'}/>
```

**Why This Is Bad:**
- **Duplicated Code**: Same loading/error pattern in every data-fetching component
- **Inconsistent UX**: Each component might handle loading differently
- **Hard to Update**: Want to change loading UI? Update every component
- **No Loading Standards**: Should we show skeleton? Spinner? Nothing?

**Why It Matters:**
Consistent loading states are critical for UX. Users should see the same loading indicators across features.

**Better Pattern:**
Create reusable data-fetching wrapper:

```typescript
// shared/components/organisms/DataBoundary.tsx
function DataBoundary({ loading, error, children }) {
  if (loading) return <LoadingSpinner />
  if (error) return <ErrorDisplay error={error} />
  return <>{children}</>
}

// Usage
<DataBoundary loading={loading} error={error}>
  <MatchListContent matches={matches} />
</DataBoundary>
```

Or even better, build it into feature hooks:

```typescript
// features/match/hooks/useMatchSearch.ts
export function useMatchSearch(filters) {
  const {data, loading, error} = useGetApi(...)

  return {
    matches: data?.matches ?? [],
    loading,
    error,
    isEmpty: !loading && data?.matches.length === 0,
    renderState: loading ? 'loading' : error ? 'error' : 'success'
  }
}

// Component can then:
const {matches, renderState} = useMatchSearch(filters)

switch (renderState) {
  case 'loading': return <LoadingSkeleton />
  case 'error': return <ErrorState />
  case 'success': return <MatchListContent matches={matches} />
}
```

**Impact:** Medium - UX consistency

---

### 12. Implement Request Cancellation in Hooks

**Current Problem:**
`useGetApi` doesn't cancel requests when component unmounts or dependencies change.

**Why This Is Bad:**
```typescript
// User navigates quickly:
// 1. Component mounts, starts fetching /v1/matches?filter=A
// 2. User changes filter to B, starts fetching /v1/matches?filter=B
// 3. First request finishes AFTER second request started
// 4. Component shows results from request 1 (wrong data!)
```

This is called a **race condition**:
- Multiple requests in flight
- Responses arrive out of order
- Component shows stale data

**Why It Matters:**
In modern SPAs, users navigate quickly. Without request cancellation:
- Memory leaks (setting state on unmounted components)
- React warnings: "Can't perform a React state update on an unmounted component"
- Race conditions showing wrong data
- Wasted bandwidth on requests nobody needs

**Expected Pattern:**
```typescript
// shared/hooks/useApi.ts
export function useGetApi<T>(endpoint: string, options?: RequestOptions) {
  useEffect(() => {
    const controller = new AbortController()

    api.get<T>(endpoint, { ...options, signal: controller.signal })
      .then(setData)
      .catch(err => {
        if (err.name !== 'AbortError') setError(err)
      })

    return () => controller.abort() // Cleanup: cancel on unmount or re-fetch
  }, [endpoint, options])
}
```

**Impact:** Medium - Prevents race conditions and memory leaks

---

## Priority 5: Feature Completeness

### 13. Complete Match Feature Implementation

**Current Problem:**
FilterBar is a stub with placeholder buttons:
```typescript
// features/match/components/FilterBar.tsx
export function FilterBar() {
    // TODO: change buttons to switches
    // TODO: dropdowns
    return (
        <div className="flex flex-col gap-xs">
            <Button buttonSize={'lg'}>LG</Button>
            <Button buttonSize={'lg'}>LG</Button>
        </div>
    )
}
```

Match page doesn't wire up filter state:
```typescript
// features/match/pages/Match.tsx
<FilterBar />  // No props, can't control state
```

MatchList has commented-out filtering logic:
```typescript
// features/match/components/MatchList.tsx
// const options = {
//     params: {
//         sort: sortType,
//         date: startDatetime.toISOString().substring(0, 10),
//         ...
//     }
// }
const options = {}  // Empty options passed instead
```

**Why This Is Bad:**
- **Incomplete Feature**: Match search doesn't actually filter
- **Misleading UX**: Filter UI exists but doesn't work
- **Dead Code**: State variables defined but never used

**Why It Matters:**
This indicates the match feature is half-implemented. The infrastructure is there but functionality isn't wired up. For a feature-based architecture to work, features should be **complete vertical slices**.

**What Needs to Happen:**
1. FilterBar should accept `filters` prop and `onFilterChange` callback
2. Match page should pass state and handlers to FilterBar
3. MatchList should receive filters and use them in API call
4. Uncomment and fix the filtering logic

This is less about architecture and more about feature completion, but it's listed here because incomplete features make it hard to evaluate if the architecture works.

**Impact:** High - Core feature functionality

---

### 14. Add Auth, Chat, and Club Feature Content

**Current Problem:**
Three features (auth, chat, club) only have placeholder pages with no real implementation.

**Why This Is Bad:**
- **Can't Validate Architecture**: Hard to tell if feature structure works with only one real feature
- **Incomplete App**: Most routes show empty pages
- **Unknown Patterns**: Don't know what these features need (API? State? Components?)

**Why It Matters:**
Feature-based architecture's value becomes clear when you have **multiple non-trivial features**. Right now:
- **Match**: Partially implemented (has components, types, API calls)
- **Profile**: Partially implemented (has components, utils, types)
- **Auth**: Minimal (just one callback page)
- **Chat**: Empty
- **Club**: Empty

You can't evaluate if features are properly isolated until multiple features need to:
- Share types (do they use shared types or duplicate?)
- Call APIs (do they have feature API layers or call directly?)
- Communicate (do they use URL params, context, or props?)

**Not Blocking:**
This isn't blocking the architecture refactoring. You can establish patterns with Match and Profile, then apply them to Chat/Club when implementing.

**Impact:** Low - Feature implementation, not architecture

---

## Priority 6: Developer Experience

### 15. Add Barrel Exports for Shared Components

**Current Problem:**
Some shared component folders have barrel exports, some don't:
```typescript
// ✅ atoms/index.ts exists - can do:
import { Button, InputText } from '@shared/components/atoms'

// ❌ layouts/index.ts exists but might not export all
import { Header } from '@shared/layouts'  // Works if exported
import { Footer } from '@shared/layouts'  // Works if exported
```

**Why This Is Bad:**
- **Inconsistent Import Style**: Some folders use index, some don't
- **Longer Imports**: Without barrel exports, must import from individual files
- **Harder Refactoring**: Moving components requires updating all imports

**Why It Matters:**
Barrel exports (`index.ts`) provide:
- **Single import point**: `import {A, B, C} from '@shared/components/atoms'`
- **Easier refactoring**: Move files without breaking imports
- **Clear public API**: What's in index.ts is public, rest is internal

**Expected Pattern:**
```typescript
// shared/layouts/index.ts
export { Header } from './Header'
export { Footer } from './Footer'
export { MobileLayout } from './MobileLayout'

// shared/hooks/index.ts - already has this
export { useGetApi } from './useApi'

// shared/api/index.ts - already has this
export { api } from './api'
```

**Impact:** Low - Developer convenience

---

### 16. Add Path Alias for Types

**Current Problem:**
Types are imported with full path:
```typescript
import { GameType } from '@shared/types'  // Works but verbose
import type { RouteHandle } from '@shared/types'
```

**Why This Could Be Better:**
Some teams prefer a dedicated types alias:
```typescript
// tsconfig.app.json
"paths": {
  "@types/*": ["./src/shared/types/*"]  // Add this
}

// Then:
import { GameType } from '@types/enums'
import type { RouteHandle } from '@types/routes'
```

**Why This Matters:**
This is **optional** and **subjective**. The current approach (`@shared/types`) is fine. The alternative (`@types`) makes it slightly clearer that you're importing types vs components/hooks.

However, note that `@types` is commonly reserved for TypeScript definition files (`@types/react`, etc.), so might cause confusion.

**Recommendation:**
Keep current approach. `@shared/types` is clear and doesn't conflict with npm `@types` packages.

**Impact:** Very Low - Stylistic preference

---

## Summary by Priority

**Priority 1 (Critical Architecture) - Do First:**
1. Fix `useGetApi` hook API design
2. Add feature-specific API layers
3. Create feature-specific hooks

**Priority 2 (Type System) - Do Next:**
4. Export feature types from barrel exports
5. Use proper types instead of inline definitions
6. Populate or remove `shared/types/common.ts`

**Priority 3 (Code Quality) - Do Soon:**
7. Remove debug console logs
8. Fix unused variable warnings
9. Replace magic numbers with constants

**Priority 4 (Infrastructure) - Do When Scaling:**
10. Add error boundaries
11. Add loading states to shared components
12. Implement request cancellation in hooks

**Priority 5 (Feature Work) - Ongoing:**
13. Complete match feature implementation
14. Add auth, chat, club feature content

**Priority 6 (Nice to Have) - Optional:**
15. Add barrel exports for shared components
16. Path alias for types (skip, current is fine)

---

## Architecture Health: 75% → 95%

**Current State:**
- ✅ Feature folders structure
- ✅ Path aliases configured
- ✅ Shared components organized
- ✅ Types properly separated
- ✅ Barrel exports for pages
- ⚠️ No feature API layers
- ⚠️ No feature-specific hooks
- ⚠️ Generic hook has poor API design
- ⚠️ Types not fully exported
- ⚠️ Some features incomplete

**After Completing Priority 1-3:**
You'll have a **production-ready feature-based architecture** that:
- Features are independent, self-contained vertical slices
- Each feature owns its API, hooks, components, types
- Shared layer is truly generic and reusable
- Type system prevents bugs at compile time
- Code is clean, maintainable, testable

The remaining items (Priority 4-6) are **enhancements** that improve resilience and UX but aren't blocking good architecture.
