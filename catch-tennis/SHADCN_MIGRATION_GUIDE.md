# shadcn/ui Migration Guide

**Project:** Catch Tennis Web App
**Current Stack:** React 19 + Tailwind CSS 4 + Custom Components
**Target:** Integrate shadcn/ui component library
**Migration Strategy:** Phased approach with incremental adoption

---

## Table of Contents

1. [Overview](#overview)
2. [Why shadcn/ui?](#why-shadcnui)
3. [Phase 0: Understanding & Setup](#phase-0-understanding--setup)
4. [Phase 1: Quick Wins - Stub Components](#phase-1-quick-wins---stub-components)
5. [Phase 2: Core Interactive Components](#phase-2-core-interactive-components)
6. [Phase 3: Custom Design Integration](#phase-3-custom-design-integration)
7. [Phase 4: Card Components](#phase-4-card-components)
8. [Phase 5: Complex Feature Components](#phase-5-complex-feature-components)
9. [Phase 6: Cleanup & Optimization](#phase-6-cleanup--optimization)
10. [Migration Checklist](#migration-checklist)
11. [Troubleshooting](#troubleshooting)

---

## Overview

### Current State
- **9 shared components** (6 atoms, 2 molecules, 1 organism)
- **Custom Tailwind CSS** with design tokens (primitives + semantics)
- **Atomic Design** pattern
- **3 stub components** awaiting implementation: DatePicker, TimePicker, DateTimeSelector

### Migration Goals
1. Replace stub components with production-ready shadcn/ui components
2. Gradually migrate custom components to shadcn/ui equivalents
3. Maintain existing design system and brand identity
4. Reduce maintenance burden on custom components
5. Gain access to accessible, battle-tested components

### Migration Philosophy
**Incremental Over Complete Rewrite**
- Migrate one component at a time
- Maintain backward compatibility during transition
- Test thoroughly after each phase
- Keep custom components where they add unique value

---

## Why shadcn/ui?

### Perfect Fit for Your Project

1. **Already Using Tailwind CSS** ✅
   - shadcn/ui uses Tailwind CSS utility classes
   - No CSS-in-JS migration needed
   - Seamless integration with your existing styles

2. **Not a Traditional Library** ✅
   - Components are copied into your codebase
   - Full ownership and customization
   - No dependency bloat or version conflicts
   - You can modify any component to fit your needs

3. **TypeScript-First** ✅
   - Fully typed components
   - Matches your strict TypeScript setup

4. **Accessible by Default** ✅
   - Built on Radix UI primitives
   - ARIA compliant
   - Keyboard navigation support

5. **Design Token Friendly** ✅
   - Uses CSS variables for theming
   - Easy integration with your existing design tokens

### What You'll Gain

- **Production-ready date/time pickers** (your current stubs)
- **Form components** with built-in validation (react-hook-form support)
- **Complex components** like Dialog, Dropdown, Popover, Select
- **Data display** components like Table, Accordion, Tabs
- **Accessibility** improvements out of the box
- **Active maintenance** and regular updates
- **Community support** and examples

---

## Phase 0: Understanding & Setup

**Goal:** Install shadcn/ui and understand how it works
**Estimated Time:** 30 minutes
**Risk Level:** Low (no code changes yet)

### Step 1: Understanding shadcn/ui Philosophy

shadcn/ui is **NOT a traditional npm package**. Instead:
- It's a CLI that copies component code into your project
- Components live in `src/components/ui/` (configurable)
- You own and can modify all component code
- Updates are manual (you decide when and what to update)

### Step 2: Installation

```bash
# Install shadcn/ui CLI
npx shadcn@latest init
```

You'll be asked several questions. **Recommended answers** for your project:

```
? Would you like to use TypeScript? › Yes
? Which style would you like to use? › New York (cleaner, matches your aesthetic)
? Which color would you like to use as base color? › Neutral (you'll customize later)
? Where is your global CSS file? › src/index.css
? Would you like to use CSS variables for colors? › Yes (matches your design tokens)
? Where is your tailwind.config.js located? › tailwind.config.js
? Configure the import alias for components? › @/components
? Configure the import alias for utils? › @/lib/utils
```

### Step 3: What Gets Created

After init, you'll have:

```
src/
├── components/
│   └── ui/              # NEW: shadcn/ui components go here
├── lib/
│   └── utils.ts         # NEW: utility functions (cn helper)
└── shared/
    └── components/      # EXISTING: your custom components
        ├── atoms/
        ├── molecules/
        └── organisms/
```

### Step 4: Understanding the File Structure

**components.json** (NEW - at project root):
- Configuration file for shadcn/ui CLI
- Defines component paths and aliases
- You can edit this anytime

**src/lib/utils.ts** (NEW):
```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// This helper merges Tailwind classes intelligently
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

This is shadcn/ui's core utility - it prevents Tailwind class conflicts.

### Step 5: Test Installation

Add your first shadcn/ui component (we won't use it yet, just testing):

```bash
npx shadcn@latest add button
```

This creates `src/components/ui/button.tsx`. Open it and observe:
- It's just a React component with TypeScript
- Uses Tailwind classes
- Uses `cn()` utility for class merging
- Has variants via `class-variance-authority` (CVA)
- You can edit it freely

### Step 6: Understand How to Use shadcn/ui Components

```tsx
// OLD WAY (your custom Button)
import { Button } from '@/shared/components/atoms/Button'

// NEW WAY (shadcn/ui Button)
import { Button } from '@/components/ui/button'

// In component:
<Button variant="default" size="sm">Click Me</Button>
```

**Key Differences:**
- Your Button: `variant="primary" buttonSize="sm"`
- shadcn Button: `variant="default" size="sm"`
- Variants are different (we'll customize this)

### Step 7: Keep Both During Migration

You can use both component libraries simultaneously:

```tsx
// Use aliases to differentiate
import { Button as ShadcnButton } from '@/components/ui/button'
import { Button as CustomButton } from '@/shared/components/atoms/Button'

// Then use whichever you need
<CustomButton variant="primary" buttonSize="md">Custom</CustomButton>
<ShadcnButton variant="default" size="md">Shadcn</ShadcnButton>
```

### Phase 0 Checklist

- [ ] Run `npx shadcn@latest init` with recommended settings
- [ ] Verify `components.json` was created
- [ ] Verify `src/lib/utils.ts` was created
- [ ] Test by adding Button: `npx shadcn@latest add button`
- [ ] Open `src/components/ui/button.tsx` and read the code
- [ ] Create a test page that uses both your custom Button and shadcn Button
- [ ] Understand that you can modify shadcn components freely

**🎯 Success Criteria:**
- shadcn/ui is installed and configured
- You understand shadcn components are just TypeScript files in your project
- You can add new shadcn components via CLI
- Both old and new components coexist

---

## Phase 1: Quick Wins - Stub Components

**Goal:** Replace incomplete stub components with shadcn/ui equivalents
**Estimated Time:** 2-3 hours
**Risk Level:** Very Low (these components are empty anyway)
**Components:** DatePicker, TimePicker, DateTimeSelector

### Why Start Here?

These components are currently **stubs** with placeholder implementations:
- `DatePicker.tsx`: Returns "Date Picker will be implemented here"
- `TimePicker.tsx`: Returns "Time Picker will be implemented here"
- `DateTimeSelector.tsx`: Returns empty div

Replacing them has:
- **Zero risk** - no existing functionality to break
- **High value** - instant production-ready implementations
- **Learning opportunity** - see shadcn/ui in action

### Step 1: Add Required shadcn/ui Components

```bash
# Calendar component (foundation for date picking)
npx shadcn@latest add calendar

# Popover component (for picker UI)
npx shadcn@latest add popover

# Button (if you haven't already)
npx shadcn@latest add button
```

This installs:
- `src/components/ui/calendar.tsx`
- `src/components/ui/popover.tsx`
- Dependencies: `react-day-picker`, `date-fns`

### Step 2: Understanding the Calendar Component

Open `src/components/ui/calendar.tsx`. You'll see:
- It uses `react-day-picker` library
- Fully accessible with keyboard navigation
- Styled with Tailwind classes
- Supports date ranges, disabled dates, etc.

### Step 3: Create DatePicker Implementation

Create a new file `src/shared/components/atoms/DatePicker.new.tsx`:

```tsx
"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  date?: Date
  onDateChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = "날짜 선택",
  disabled = false
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
```

**What's happening here:**
1. **Popover:** A floating panel that appears on click
2. **PopoverTrigger:** The button that opens the popover
3. **Calendar:** The actual date picker inside the popover
4. **format():** date-fns function to format the selected date
5. **cn():** Merges Tailwind classes conditionally

### Step 4: Customize with Your Design Tokens

Modify the DatePicker to use your design tokens:

```tsx
<Button
  variant="outline"
  className={cn(
    "w-full justify-start text-left",
    "rounded-sm border-sm border-border",  // Your design tokens
    "bg-surface-raised p-md",              // Your design tokens
    "text-heading-h4",                     // Your typography
    !date && "text-text-muted"             // Your text color
  )}
  disabled={disabled}
>
  <CalendarIcon className="mr-2 h-4 w-4" />
  {date ? format(date, "yyyy-MM-dd") : <span>{placeholder}</span>}
</Button>
```

### Step 5: Test the DatePicker

Create a test page or add to an existing page:

```tsx
import { useState } from "react"
import { DatePicker } from "@/shared/components/atoms/DatePicker.new"

function TestPage() {
  const [date, setDate] = useState<Date>()

  return (
    <div className="p-md">
      <h2 className="text-heading-h2 mb-md">Date Picker Test</h2>
      <DatePicker
        date={date}
        onDateChange={setDate}
        placeholder="날짜를 선택하세요"
      />
      {date && (
        <p className="mt-md text-body">
          Selected: {date.toLocaleDateString()}
        </p>
      )}
    </div>
  )
}
```

### Step 6: Create TimePicker Implementation

For time picking, shadcn/ui doesn't have a built-in component, but you can use `Input` with customization:

```bash
npx shadcn@latest add input
```

Create `src/shared/components/atoms/TimePicker.new.tsx`:

```tsx
import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface TimePickerProps {
  time?: string  // Format: "HH:mm"
  onTimeChange?: (time: string) => void
  placeholder?: string
  disabled?: boolean
}

export function TimePicker({
  time,
  onTimeChange,
  placeholder = "시간 선택",
  disabled = false
}: TimePickerProps) {
  return (
    <Input
      type="time"
      value={time}
      onChange={(e) => onTimeChange?.(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={cn(
        "w-full",
        "rounded-sm border-sm border-border",
        "bg-surface-raised p-md",
        "text-heading-h4"
      )}
    />
  )
}
```

**Alternative:** Use a more sophisticated time picker library with shadcn/ui styling, or build a custom dropdown with hour/minute selectors.

### Step 7: Create DateTimeSelector

Combine both components in `src/shared/components/organisms/DateTimeSelector.new.tsx`:

```tsx
import * as React from "react"
import { DatePicker } from "@/shared/components/atoms/DatePicker.new"
import { TimePicker } from "@/shared/components/atoms/TimePicker.new"

interface DateTimeSelectorProps {
  date?: Date
  time?: string
  onDateChange?: (date: Date | undefined) => void
  onTimeChange?: (time: string) => void
  disabled?: boolean
}

export function DateTimeSelector({
  date,
  time,
  onDateChange,
  onTimeChange,
  disabled = false
}: DateTimeSelectorProps) {
  return (
    <div className="flex flex-col gap-md">
      <div>
        <label className="text-small text-text-muted mb-xs block">
          날짜
        </label>
        <DatePicker
          date={date}
          onDateChange={onDateChange}
          disabled={disabled}
        />
      </div>
      <div>
        <label className="text-small text-text-muted mb-xs block">
          시간
        </label>
        <TimePicker
          time={time}
          onTimeChange={onTimeChange}
          disabled={disabled}
        />
      </div>
    </div>
  )
}
```

### Step 8: Replace Old Stubs

Once tested and working:

1. **Backup old files** (optional):
   ```bash
   mv src/shared/components/atoms/DatePicker.tsx src/shared/components/atoms/DatePicker.old.tsx
   mv src/shared/components/atoms/TimePicker.tsx src/shared/components/atoms/TimePicker.old.tsx
   mv src/shared/components/organisms/DateTimeSelector.tsx src/shared/components/organisms/DateTimeSelector.old.tsx
   ```

2. **Rename new files**:
   ```bash
   mv src/shared/components/atoms/DatePicker.new.tsx src/shared/components/atoms/DatePicker.tsx
   mv src/shared/components/atoms/TimePicker.new.tsx src/shared/components/atoms/TimePicker.tsx
   mv src/shared/components/organisms/DateTimeSelector.new.tsx src/shared/components/organisms/DateTimeSelector.tsx
   ```

3. **Update index.ts**:
   ```typescript
   // src/shared/components/atoms/index.ts
   export { DatePicker } from './DatePicker';
   export { TimePicker } from './TimePicker';
   ```

### Step 9: Find All Usage and Update

```bash
# Find where DatePicker/TimePicker/DateTimeSelector are used
grep -r "DatePicker\|TimePicker\|DateTimeSelector" src/features/
```

Update import statements and ensure prop interfaces match.

### Phase 1 Checklist

- [ ] Install calendar, popover, button, input from shadcn/ui
- [ ] Create DatePicker.new.tsx with shadcn/ui components
- [ ] Customize DatePicker with your design tokens
- [ ] Test DatePicker in isolation
- [ ] Create TimePicker.new.tsx
- [ ] Test TimePicker in isolation
- [ ] Create DateTimeSelector.new.tsx combining both
- [ ] Test DateTimeSelector in a real feature (e.g., match creation)
- [ ] Replace old stub files with new implementations
- [ ] Update all imports across the codebase
- [ ] Run `npm run build` to verify no type errors
- [ ] Test in browser - verify functionality and styling

**🎯 Success Criteria:**
- Date and time picking works in your app
- Components match your design system visually
- No TypeScript errors
- Accessible (keyboard navigation works)
- All features using these components still work

**💡 What You Learned:**
- How to install shadcn/ui components via CLI
- How shadcn/ui components compose together (Calendar + Popover = DatePicker)
- How to customize shadcn/ui with your design tokens
- How to integrate shadcn/ui into your existing component structure

---

## Phase 2: Core Interactive Components

**Goal:** Migrate core reusable components to shadcn/ui
**Estimated Time:** 4-6 hours
**Risk Level:** Medium (affects multiple features)
**Components:** Button, InputText

### Why These Components?

Button and InputText are **foundational** components used everywhere:
- High impact across entire app
- Relatively simple to migrate
- shadcn/ui versions are battle-tested
- Good learning experience for more complex migrations

### Decision Point: Replace or Wrap?

You have two strategies:

**Strategy A: Complete Replacement**
- Delete custom Button/InputText
- Use shadcn/ui versions directly
- Update all imports across codebase
- Customize shadcn/ui to match your design

**Strategy B: Wrapper Approach** (Recommended for gradual migration)
- Keep your custom Button/InputText API
- Internally use shadcn/ui components
- Gradual migration feature by feature
- Less disruptive

We'll use **Strategy B** here.

### Step 1: Install shadcn/ui Components

```bash
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add label
```

### Step 2: Understand Your Current Button API

Your current Button (`src/shared/components/atoms/Button.tsx:1-39`):

```typescript
interface ButtonProps {
  variant?: 'primary' | 'info' | 'inactive';
  buttonSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
}
```

shadcn/ui Button has:
```typescript
interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}
```

**Mapping needed:**
- `primary` → customize `default` variant
- `info` → customize or create new variant
- `inactive` → `secondary` or customize
- Your sizes → customize shadcn sizes

### Step 3: Customize shadcn/ui Button

Open `src/components/ui/button.tsx` and modify the variants:

```tsx
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  // Base styles - use your design tokens
  "inline-flex items-center justify-center rounded-sm border-sm text-heading-h3 transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Customize to match your design
        primary: "bg-primary text-text-body border-primary-border hover:bg-primary/90",
        info: "bg-info text-text-title border-info-border hover:bg-info/90",
        inactive: "bg-surface-muted text-text-muted border-border",
        // Keep shadcn originals if you want
        default: "bg-primary text-text-body border-primary-border",
        destructive: "bg-error text-text-title border-error-border",
        outline: "border border-border bg-surface hover:bg-surface-muted",
        secondary: "bg-surface-muted text-text-body",
        ghost: "hover:bg-surface-muted",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        // Match your current sizes
        xs: "px-sm py-xs w-[40px]",
        sm: "px-sm py-xs w-[80px]",
        md: "px-sm py-xs w-[120px]",
        lg: "px-sm py-sm w-[180px]",
        xl: "px-sm py-sm w-[280px]",
        full: "px-xl py-sm w-full",
        // Keep shadcn defaults
        default: "h-9 px-4 py-2",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "sm",
    },
  }
)
```

**What we did:**
1. Added your `primary`, `info`, `inactive` variants
2. Added your exact size system (`xs`, `sm`, `md`, `lg`, `xl`, `full`)
3. Used your design tokens (`bg-primary`, `text-heading-h3`, etc.)
4. Kept shadcn defaults for flexibility

### Step 4: Create Wrapper Button (Optional)

If you want to keep your exact API, create a wrapper:

```tsx
// src/shared/components/atoms/Button.shadcn.tsx
import { Button as ShadcnButton } from "@/components/ui/button"
import type { ButtonHTMLAttributes } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'info' | 'inactive';
  buttonSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export function Button({
  variant = 'primary',
  buttonSize = 'sm',
  children,
  ...rest
}: ButtonProps) {
  return (
    <ShadcnButton
      variant={variant}
      size={buttonSize}
      {...rest}
    >
      {children}
    </ShadcnButton>
  )
}
```

Now your wrapper has the **exact same API** as before, but uses shadcn/ui internally!

### Step 5: Test Button Migration

Create a comparison page:

```tsx
// src/pages/ButtonTest.tsx
import { Button as OldButton } from "@/shared/components/atoms/Button"
import { Button as NewButton } from "@/shared/components/atoms/Button.shadcn"

export function ButtonTest() {
  return (
    <div className="p-md space-y-lg">
      <section>
        <h2 className="text-heading-h2 mb-md">Old Button</h2>
        <div className="flex gap-sm">
          <OldButton variant="primary" buttonSize="sm">Primary</OldButton>
          <OldButton variant="info" buttonSize="md">Info</OldButton>
          <OldButton variant="inactive" buttonSize="lg">Inactive</OldButton>
        </div>
      </section>

      <section>
        <h2 className="text-heading-h2 mb-md">New Button (shadcn/ui)</h2>
        <div className="flex gap-sm">
          <NewButton variant="primary" buttonSize="sm">Primary</NewButton>
          <NewButton variant="info" buttonSize="md">Info</NewButton>
          <NewButton variant="inactive" buttonSize="lg">Inactive</NewButton>
        </div>
      </section>
    </div>
  )
}
```

**Compare:**
- Visual appearance (should be identical)
- Hover states
- Click behavior
- Disabled state
- Loading state (if applicable)

### Step 6: Migrate InputText

Your current InputText (`src/shared/components/atoms/InputText.tsx:1-23`):

```typescript
interface InputTextProps {
  inputSize: 'big';
}
```

shadcn/ui Input is simpler - just extends native input. Let's customize it:

```tsx
// src/components/ui/input.tsx
// Add this after the default Input definition

import { cn } from "@/lib/utils"

// Wrapper with your design system
export const InputText = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    inputSize?: 'big'
  }
>(({ className, inputSize = 'big', ...props }, ref) => {
  return (
    <input
      className={cn(
        // Your design tokens
        "p-md rounded-sm bg-surface-raised border-sm border-border text-heading-h4",
        inputSize === 'big' && "w-full",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
InputText.displayName = "InputText"
```

Or create a wrapper in your atoms folder:

```tsx
// src/shared/components/atoms/InputText.shadcn.tsx
import { Input } from "@/components/ui/input"
import type { InputHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface InputTextProps extends InputHTMLAttributes<HTMLInputElement> {
  inputSize?: 'big';
}

export function InputText({
  inputSize = 'big',
  className,
  ...rest
}: InputTextProps) {
  return (
    <Input
      className={cn(
        "p-md rounded-sm bg-surface-raised border-sm border-border text-heading-h4",
        inputSize === 'big' && "w-full",
        className
      )}
      {...rest}
    />
  )
}
```

### Step 7: Gradual Rollout Strategy

**Option 1: Feature Flag**
```tsx
// src/shared/config/features.ts
export const USE_SHADCN_COMPONENTS = true

// In components:
import { Button as OldButton } from "@/shared/components/atoms/Button"
import { Button as ShadcnButton } from "@/shared/components/atoms/Button.shadcn"
import { USE_SHADCN_COMPONENTS } from "@/shared/config/features"

const Button = USE_SHADCN_COMPONENTS ? ShadcnButton : OldButton
```

**Option 2: Feature-by-Feature**
- Migrate one feature at a time (e.g., auth feature first)
- Test thoroughly
- Move to next feature
- Finally replace global components

**Option 3: Direct Replacement** (if tests pass)
1. Rename: `Button.tsx` → `Button.old.tsx`
2. Rename: `Button.shadcn.tsx` → `Button.tsx`
3. Run build and fix any issues
4. Test entire app

### Step 8: Add Form Components (Bonus)

While you're at it, add shadcn/ui form components for future use:

```bash
npx shadcn@latest add form
npx shadcn@latest add textarea
npx shadcn@latest add checkbox
npx shadcn@latest add radio-group
npx shadcn@latest add select
npx shadcn@latest add switch
```

These will be useful for your FilterBar TODO and ProfileComplete form.

### Phase 2 Checklist

- [ ] Install button and input from shadcn/ui
- [ ] Customize button variants to match your design
- [ ] Customize button sizes to match your current API
- [ ] Test color mappings (primary, info, inactive)
- [ ] Create Button wrapper or directly modify shadcn component
- [ ] Create InputText wrapper with your design tokens
- [ ] Build comparison page to verify visual parity
- [ ] Choose rollout strategy (feature flag, feature-by-feature, or direct)
- [ ] Update components in one feature as proof-of-concept
- [ ] Test thoroughly (click events, forms, disabled states)
- [ ] Roll out to remaining features
- [ ] Remove old component files once confident
- [ ] Update documentation/exports in index.ts

**🎯 Success Criteria:**
- Button and Input look identical to before
- All click handlers still work
- Forms still submit correctly
- No visual regressions
- TypeScript compiles without errors
- All features function as before

**💡 What You Learned:**
- How to customize shadcn/ui component variants
- How to use `class-variance-authority` (CVA) for variant management
- How to create wrapper components for API compatibility
- Gradual migration strategies

---

## Phase 3: Custom Design Integration

**Goal:** Integrate your design token system with shadcn/ui's theming
**Estimated Time:** 3-4 hours
**Risk Level:** Medium (affects global styling)

### Understanding the Gap

**Your System:**
- Two-tier token system (primitives → semantics)
- Custom Tailwind utilities (`text-heading-h2`, `gap-md`, etc.)
- CSS variables for colors

**shadcn/ui System:**
- CSS variables in `:root` (HSL color format)
- Tailwind utilities (`text-primary`, `bg-muted`, etc.)
- Automatic dark mode support

### Strategy: Merge Both Systems

Don't replace your tokens - **extend** shadcn/ui to use them!

### Step 1: Analyze shadcn/ui Globals

When you ran `init`, shadcn/ui added CSS variables to your `src/index.css`:

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    /* ... more variables */
  }
}
```

These use **HSL format** (Hue Saturation Lightness).

### Step 2: Convert Your Colors to HSL

Your current colors are in HEX. Let's convert them:

**Primitive Primary:**
- `--color-primary-500: #E1FF00` → HSL: `67, 100%, 50%`

**Semantic Colors:**
- `--color-text-title: #20211C` (neutral-900) → HSL: `60, 10%, 12%`
- `--color-text-body: #55564D` (neutral-700) → HSL: `65, 9%, 32%`
- `--color-primary: #E1FF00` → HSL: `67, 100%, 50%`

Use an online converter: https://htmlcolors.com/hex-to-hsl

### Step 3: Update index.css with Your Tokens

Modify `src/index.css` to use your existing variables:

```css
@import './shared/styles/primitives/colors.css';
@import './shared/styles/primitives/spacing.css';
@import './shared/styles/primitives/typography.css';
@import './shared/styles/semantics/colors.css';
@import './shared/styles/semantics/layout.css';
@import './shared/styles/semantics/typography.css';

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-text-body;
  }

  :root {
    /* Map shadcn/ui variables to your design tokens */

    /* Background & Foreground */
    --background: var(--color-background);
    --foreground: var(--color-text-body);

    /* Primary */
    --primary: var(--color-primary);
    --primary-foreground: var(--color-text-body);

    /* Secondary */
    --secondary: var(--color-neutral-300);
    --secondary-foreground: var(--color-text-title);

    /* Muted */
    --muted: var(--color-surface-muted);
    --muted-foreground: var(--color-text-muted);

    /* Accent */
    --accent: var(--color-info);
    --accent-foreground: var(--color-text-title);

    /* Destructive */
    --destructive: var(--color-error);
    --destructive-foreground: var(--color-text-title);

    /* Borders */
    --border: var(--color-border);
    --input: var(--color-border);
    --ring: var(--color-primary);

    /* Card */
    --card: var(--color-surface);
    --card-foreground: var(--color-text-body);

    /* Popover */
    --popover: var(--color-surface);
    --popover-foreground: var(--color-text-body);

    /* Radius */
    --radius: 0.375rem; /* Adjust to match your border-radius */
  }
}
```

**Alternative: Keep HSL Format for shadcn, Reference Your Tokens**

```css
:root {
  /* shadcn/ui semantic colors pointing to your primitives */
  --background: 48 14% 97%;  /* neutral-100 */
  --foreground: 64 11% 12%;  /* neutral-900 */
  --primary: 67 100% 50%;     /* primary-500 */
  --primary-foreground: 64 11% 12%;
  /* ... etc */
}
```

### Step 4: Update Tailwind Config

Ensure your `tailwind.config.js` includes both systems:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Your existing custom tokens
      colors: {
        'text-title': 'var(--color-text-title)',
        'text-body': 'var(--color-text-body)',
        'text-muted': 'var(--color-text-muted)',
        'border': 'var(--color-border)',
        'surface': 'var(--color-surface)',
        'surface-muted': 'var(--color-surface-muted)',
        'surface-raised': 'var(--color-surface-raised)',
        'background': 'var(--color-background)',
        'primary': 'var(--color-primary)',
        'primary-border': 'var(--color-primary-border)',
        'primary-bg': 'var(--color-primary-bg)',
        'success': 'var(--color-success)',
        'info': 'var(--color-info)',
        'warning': 'var(--color-warning)',
        'error': 'var(--color-error)',
      },
      spacing: {
        'xs': 'var(--spacing-xs)',
        'sm': 'var(--spacing-sm)',
        'md': 'var(--spacing-md)',
        'lg': 'var(--spacing-lg)',
        'xl': 'var(--spacing-xl)',
        '5xl': 'var(--spacing-5xl)',
      },
      borderRadius: {
        'sm': 'var(--radius-sm)',
        'md': 'var(--radius-md)',
        'lg': 'var(--radius-lg)',
        'xl': 'var(--radius-xl)',
      },
      borderWidth: {
        'sm': 'var(--border-width-sm)',
        'md': 'var(--border-width-md)',
      }
    },
  },
  plugins: [],
}
```

### Step 5: Test Integration

Create a test page that uses both token systems:

```tsx
export function DesignTokenTest() {
  return (
    <div className="p-md space-y-md">
      {/* Your custom tokens */}
      <div className="bg-surface-raised p-md border-sm border-border rounded-sm">
        <p className="text-heading-h3 text-text-title">Custom Token System</p>
        <p className="text-body text-text-body">Body text with custom tokens</p>
      </div>

      {/* shadcn/ui tokens */}
      <div className="bg-card p-4 border rounded-md">
        <p className="text-lg font-semibold text-foreground">shadcn/ui Tokens</p>
        <p className="text-sm text-muted-foreground">Muted foreground text</p>
      </div>
    </div>
  )
}
```

Both should work harmoniously!

### Step 6: Document Token Mapping

Create a reference document for your team:

```markdown
# Design Token Mapping

## Color Mappings

| shadcn/ui Token | Your Token | HEX Value | Usage |
|----------------|------------|-----------|-------|
| `--background` | `--color-background` | #FAFAF9 | Page background |
| `--foreground` | `--color-text-body` | #55564D | Primary text |
| `--primary` | `--color-primary` | #E1FF00 | Primary actions |
| `--muted` | `--color-surface-muted` | #E9EAE6 | Muted surfaces |

## Tailwind Class Equivalents

| Your Class | shadcn Class | Usage |
|-----------|-------------|--------|
| `text-text-title` | `text-foreground` | Titles |
| `text-text-muted` | `text-muted-foreground` | Secondary text |
| `bg-surface` | `bg-card` | Card backgrounds |
| `border-border` | `border-border` | Borders (same!) |
```

### Phase 3 Checklist

- [ ] Understand your current token system
- [ ] Convert HEX colors to HSL (if needed)
- [ ] Update `src/index.css` to map shadcn variables to your tokens
- [ ] Update `tailwind.config.js` to include both systems
- [ ] Test that your custom utilities still work
- [ ] Test that shadcn/ui components render correctly
- [ ] Create token mapping documentation
- [ ] Educate team on which tokens to use when

**🎯 Success Criteria:**
- Both token systems coexist
- shadcn/ui components use your brand colors
- Your custom components still look correct
- No CSS conflicts or specificity issues
- Documentation exists for token usage

**💡 What You Learned:**
- How to integrate custom design tokens with shadcn/ui
- CSS variable mapping strategies
- Tailwind config customization
- Maintaining design consistency during migration

---

## Phase 4: Card Components

**Goal:** Migrate or enhance card components with shadcn/ui patterns
**Estimated Time:** 2-3 hours
**Risk Level:** Low-Medium
**Components:** CourtCard, ProfileCard

### Context

Your card components are well-implemented and custom to your domain:
- **CourtCard**: Displays court info with thumbnail
- **ProfileCard**: Shows user profile with avatar

shadcn/ui doesn't have domain-specific cards, but it has a **Card component** with good structure.

### Strategy: Enhance, Don't Replace

Keep your custom cards but enhance them with shadcn/ui Card structure for better consistency and accessibility.

### Step 1: Install shadcn/ui Card

```bash
npx shadcn@latest add card
```

This creates `src/components/ui/card.tsx` with:
- `Card` - Container
- `CardHeader` - Top section
- `CardTitle` - Title
- `CardDescription` - Subtitle
- `CardContent` - Main content
- `CardFooter` - Bottom section

### Step 2: Understand Card Anatomy

shadcn/ui Card is just structural:

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Content goes here</p>
  </CardContent>
  <CardFooter>
    <p>Footer actions</p>
  </CardFooter>
</Card>
```

### Step 3: Refactor CourtCard (Optional Enhancement)

Your current CourtCard:

```tsx
// Simplified view
<div className="flex flex-col gap-sm border-border border-sm rounded-md">
  <ImgLoader imgType='unknown' size='medium' shape='square' unknownSrc={thumbnail} />
  <div className="p-sm">
    <p className="text-body">{name}</p>
    <p className="text-small text-text-muted">{address}</p>
  </div>
</div>
```

Enhanced with shadcn Card:

```tsx
import { Card, CardContent } from "@/components/ui/card"
import { ImgLoader } from "@/shared/components/atoms/ImgLoader"

export function CourtCard({ courtInfo }: { courtInfo: CourtInfo }) {
  const { name, address, thumbnail } = courtInfo

  return (
    <Card className="overflow-hidden">
      <ImgLoader
        imgType='unknown'
        size='medium'
        shape='square'
        unknownSrc={thumbnail}
        className="w-full"
      />
      <CardContent className="p-sm">
        <p className="text-body font-semibold">{name}</p>
        <p className="text-small text-muted-foreground">{address}</p>
      </CardContent>
    </Card>
  )
}
```

**Benefits:**
- Better semantic HTML structure
- Consistent card styling across app
- Easier to add headers/footers later
- Better accessibility

### Step 4: Refactor ProfileCard

Current ProfileCard shows user info. Enhance it:

```tsx
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ImgLoader } from "@/shared/components/atoms/ImgLoader"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

// Install avatar first if you want:
// npx shadcn@latest add avatar

export function ProfileCard({ profile }: { profile: ProfileData }) {
  const { nickname, gender, age, period, profileImage } = profile

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-md">
        <Avatar className="h-16 w-16">
          <AvatarImage src={profileImage} alt={nickname} />
          <AvatarFallback>{nickname[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-heading-h3">{nickname}</h3>
          <p className="text-small text-muted-foreground">
            {gender} • {age}세
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-body">경력: {period}</p>
      </CardContent>
    </Card>
  )
}
```

### Step 5: Create Reusable Card Patterns

Create common card patterns for your domain:

```tsx
// src/shared/components/molecules/CardPatterns.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImgLoader } from "@/shared/components/atoms/ImgLoader"

// Image Card Pattern (for courts, venues, etc.)
export function ImageCard({
  title,
  description,
  imageSrc,
  imageAlt,
  onClick
}: ImageCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <ImgLoader
        imgType='unknown'
        size='medium'
        shape='square'
        unknownSrc={imageSrc}
        className="w-full"
      />
      <CardContent className="p-sm">
        <h3 className="text-body font-semibold">{title}</h3>
        {description && (
          <p className="text-small text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}

// Profile Card Pattern
export function ProfileCardPattern({
  name,
  subtitle,
  imageSrc,
  metadata,
  actions
}: ProfileCardPatternProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-md">
        <Avatar>
          <AvatarImage src={imageSrc} alt={name} />
          <AvatarFallback>{name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-heading-h3">{name}</CardTitle>
          <p className="text-small text-muted-foreground">{subtitle}</p>
        </div>
        {actions}
      </CardHeader>
      {metadata && (
        <CardContent>
          {metadata}
        </CardContent>
      )}
    </Card>
  )
}
```

### Step 6: Add MatchCard Enhancement

Your `MatchCard` in features could benefit from Card structure:

```tsx
// src/features/match/components/MatchCard.tsx
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function MatchCard({ match }: { match: MatchData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{match.title}</CardTitle>
        <p className="text-small text-muted-foreground">
          {match.date} • {match.time}
        </p>
      </CardHeader>
      <CardContent>
        <p className="text-body">{match.location}</p>
        <p className="text-small">{match.participants}명 참가</p>
      </CardContent>
      <CardFooter className="flex gap-sm">
        <Button variant="primary" size="sm">참가하기</Button>
        <Button variant="outline" size="sm">상세보기</Button>
      </CardFooter>
    </Card>
  )
}
```

### Phase 4 Checklist

- [ ] Install shadcn/ui Card component
- [ ] Install shadcn/ui Avatar component (optional)
- [ ] Review current CourtCard and ProfileCard implementations
- [ ] Decide: refactor or keep as-is?
- [ ] If refactoring, create .new.tsx versions first
- [ ] Test new card components in isolation
- [ ] Verify styling matches design system
- [ ] Test interactive states (hover, click)
- [ ] Create reusable card patterns if needed
- [ ] Apply card pattern to MatchCard and other feature cards
- [ ] Replace old implementations once tested
- [ ] Update all imports and exports

**🎯 Success Criteria:**
- Cards have consistent structure across app
- Styling matches your design system
- Interactive states work correctly
- Accessibility improved (semantic HTML)
- No visual regressions

**💡 What You Learned:**
- How to use shadcn/ui structural components
- When to enhance vs. replace custom components
- Creating reusable component patterns
- Composition patterns with Card subcomponents

---

## Phase 5: Complex Feature Components

**Goal:** Enhance complex components with shadcn/ui patterns
**Estimated Time:** 6-8 hours
**Risk Level:** High (complex logic, many dependencies)
**Components:** FilterBar, ChatRoomItem, MessageItem, ProfileComplete

### When to Migrate Complex Components

**Don't rush this phase!** Only migrate when:
- Phases 1-4 are complete and stable
- You're comfortable with shadcn/ui patterns
- You have comprehensive tests
- You have time for thorough testing

### Component-by-Component Strategy

#### 1. FilterBar (High Value, Low Risk)

Current: Placeholder with TODOs
Opportunity: Replace with shadcn/ui Select, Switch, etc.

```bash
# Install needed components
npx shadcn@latest add select
npx shadcn@latest add switch
npx shadcn@latest add slider
npx shadcn@latest add combobox
```

**New Implementation:**

```tsx
// src/features/match/components/FilterBar.tsx
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

export function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  return (
    <div className="flex flex-col gap-md p-md bg-surface border-b border-border">
      {/* Location Filter */}
      <div className="flex items-center justify-between">
        <Label htmlFor="location">지역</Label>
        <Select
          value={filters.location}
          onValueChange={(value) => onFilterChange('location', value)}
        >
          <SelectTrigger id="location" className="w-[180px]">
            <SelectValue placeholder="지역 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="seoul">서울</SelectItem>
            <SelectItem value="busan">부산</SelectItem>
            <SelectItem value="daegu">대구</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Level Filter */}
      <div className="flex items-center justify-between">
        <Label htmlFor="level">레벨</Label>
        <Select
          value={filters.level}
          onValueChange={(value) => onFilterChange('level', value)}
        >
          <SelectTrigger id="level" className="w-[180px]">
            <SelectValue placeholder="레벨 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beginner">초급</SelectItem>
            <SelectItem value="intermediate">중급</SelectItem>
            <SelectItem value="advanced">고급</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Available Only Toggle */}
      <div className="flex items-center justify-between">
        <Label htmlFor="available">참가 가능만 보기</Label>
        <Switch
          id="available"
          checked={filters.availableOnly}
          onCheckedChange={(checked) => onFilterChange('availableOnly', checked)}
        />
      </div>
    </div>
  )
}
```

**Benefits:**
- Accessible select dropdowns with keyboard navigation
- Touch-friendly on mobile
- Consistent styling
- Built-in animations

#### 2. ChatRoomItem (Keep Custom, Add Enhancements)

Current: Complex component with time formatting, unread badges
Strategy: Keep most logic, enhance with shadcn/ui Badge

```bash
npx shadcn@latest add badge
```

**Enhanced Version:**

```tsx
// src/features/chat/components/ChatRoomItem.tsx
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function ChatRoomItem({ room }: ChatRoomItemProps) {
  return (
    <div className="flex items-center gap-md p-md hover:bg-surface-muted cursor-pointer">
      <Avatar>
        <AvatarImage src={room.thumbnail} />
        <AvatarFallback>{room.title[0]}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="text-body font-semibold truncate">{room.title}</h3>
          <span className="text-caption text-muted-foreground">
            {formatTime(room.lastMessageTime)}
          </span>
        </div>
        <p className="text-small text-muted-foreground truncate">
          {room.lastMessage}
        </p>
      </div>

      {room.unreadCount > 0 && (
        <Badge variant="destructive" className="ml-auto">
          {room.unreadCount}
        </Badge>
      )}
    </div>
  )
}
```

#### 3. MessageItem (Keep Custom)

Current: Complex layout with conditional rendering
Strategy: **Keep as-is** - too domain-specific

Optional enhancement: Use shadcn/ui Avatar

```tsx
// Minor enhancement only
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// In MessageItem render:
{showProfile && (
  <Avatar className="h-8 w-8">
    <AvatarImage src={profile.image} />
    <AvatarFallback>{profile.name[0]}</AvatarFallback>
  </Avatar>
)}
```

#### 4. ProfileComplete (High Value Enhancement)

Current: Custom form with dynamic rendering
Opportunity: Use shadcn/ui Form components for better validation and UX

```bash
npx shadcn@latest add form
npx shadcn@latest add radio-group
npx shadcn@latest add textarea
```

**Enhanced with react-hook-form:**

```tsx
// src/features/profile/components/ProfileComplete.tsx
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"

const profileSchema = z.object({
  nickname: z.string().min(2, "닉네임은 2자 이상이어야 합니다"),
  gender: z.enum(["male", "female"]),
  age: z.number().min(10).max(100),
  level: z.enum(["beginner", "intermediate", "advanced"]),
})

export function ProfileComplete() {
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nickname: "",
      gender: undefined,
      age: undefined,
      level: undefined,
    },
  })

  function onSubmit(values: z.infer<typeof profileSchema>) {
    console.log(values)
    // Submit to API
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-md">
        <FormField
          control={form.control}
          name="nickname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>닉네임</FormLabel>
              <FormControl>
                <Input placeholder="닉네임을 입력하세요" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>성별</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="male" />
                    </FormControl>
                    <FormLabel className="font-normal">남성</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="female" />
                    </FormControl>
                    <FormLabel className="font-normal">여성</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" variant="primary" size="full">
          프로필 완성하기
        </Button>
      </form>
    </Form>
  )
}
```

**Benefits:**
- Built-in validation with Zod schema
- Automatic error messages
- Better accessibility
- Type-safe form values
- Handles complex form state

### Phase 5 Checklist

- [ ] Complete Phases 1-4 first
- [ ] Identify which complex components need migration
- [ ] Install required shadcn/ui components (Select, Switch, Form, etc.)
- [ ] Start with FilterBar (high value, currently placeholder)
- [ ] Implement FilterBar with Select and Switch components
- [ ] Test filtering functionality thoroughly
- [ ] Enhance ChatRoomItem with Badge and Avatar
- [ ] Consider ProfileComplete form migration to react-hook-form + shadcn
- [ ] Keep MessageItem mostly custom (domain-specific)
- [ ] Test all enhanced components in real usage scenarios
- [ ] Verify no regressions in complex user flows (chat, profile creation, filtering)

**🎯 Success Criteria:**
- FilterBar has working dropdowns and switches
- Form validation works in ProfileComplete
- Chat components maintain their functionality
- All complex interactions still work
- No performance degradation

**💡 What You Learned:**
- When to migrate vs. when to keep custom components
- How to use shadcn/ui Form with validation
- Composition patterns for complex components
- Balancing customization with library usage

---

## Phase 6: Cleanup & Optimization

**Goal:** Remove technical debt, optimize bundle, finalize migration
**Estimated Time:** 2-3 hours
**Risk Level:** Low

### Step 1: Remove Old Components

Once fully migrated and tested:

```bash
# Remove old custom component files
rm src/shared/components/atoms/Button.old.tsx
rm src/shared/components/atoms/InputText.old.tsx
rm src/shared/components/atoms/DatePicker.old.tsx
rm src/shared/components/atoms/TimePicker.old.tsx
rm src/shared/components/organisms/DateTimeSelector.old.tsx
```

### Step 2: Clean Up Unused CSS

Review your design token files for unused variables:

```bash
# Find CSS variables that are no longer referenced
grep -r "--color-" src/ | grep -v ".css" | cut -d: -f2 | sort | uniq
```

### Step 3: Update Index Exports

Ensure all exports in `index.ts` files are correct:

```typescript
// src/shared/components/atoms/index.ts
export { Button } from './Button';
export { InputText } from './InputText';
export { IconLoader } from './IconLoader';
export { ImgLoader } from './ImgLoader';
export { DatePicker } from './DatePicker';
export { TimePicker } from './TimePicker';

// Export shadcn/ui components for convenience
export { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
export { Badge } from '@/components/ui/badge';
```

### Step 4: Bundle Size Optimization

```bash
# Analyze bundle size
npm run build
npx vite-bundle-visualizer
```

Check that:
- You're not importing both old and new component versions
- Unused shadcn/ui components are tree-shaken
- Dependencies are optimized (date-fns can be large - consider imports)

**Optimize date-fns imports:**

```tsx
// Instead of:
import { format } from "date-fns"

// Use specific imports:
import format from "date-fns/format"
```

### Step 5: Document Component Library

Create or update `COMPONENTS.md`:

```markdown
# Component Library

## Atoms

### Button
- **Location:** `src/shared/components/atoms/Button.tsx`
- **Based on:** shadcn/ui Button
- **Variants:** primary, info, inactive, outline, ghost
- **Sizes:** xs, sm, md, lg, xl, full
- **Usage:**
  ```tsx
  import { Button } from '@/shared/components/atoms/Button'
  <Button variant="primary" size="md">Click Me</Button>
  ```

### InputText
- **Location:** `src/shared/components/atoms/InputText.tsx`
- **Based on:** shadcn/ui Input
- **Sizes:** big (full width)
- **Usage:**
  ```tsx
  import { InputText } from '@/shared/components/atoms/InputText'
  <InputText inputSize="big" placeholder="Enter text" />
  ```

[... document all components ...]

## shadcn/ui Components

Available shadcn/ui components (imported from `@/components/ui/`):
- Avatar, Badge, Button, Calendar, Card, Form, Input, Label, Popover, Select, Switch, Textarea

Refer to [shadcn/ui docs](https://ui.shadcn.com/) for usage.
```

### Step 6: Update Team Guidelines

Create `CONTRIBUTING.md` section on components:

```markdown
## Component Guidelines

### When to use custom components vs. shadcn/ui

**Use custom components (from `src/shared/components/`) for:**
- Domain-specific components (CourtCard, ProfileCard, MatchCard)
- Components with our brand styling (Button, InputText)
- Complex custom logic (ChatRoomItem, MessageItem)

**Use shadcn/ui directly (from `@/components/ui/`) for:**
- New features needing standard components (Dialog, Tabs, Accordion)
- Temporary prototyping
- Components not yet in our custom library

**Customization:**
- shadcn/ui components can be modified directly in `src/components/ui/`
- Wrap shadcn/ui components in `src/shared/components/` if used frequently
- Maintain design token consistency

### Adding new shadcn/ui components

```bash
npx shadcn@latest add <component-name>
```

After adding:
1. Customize with design tokens if needed
2. Test accessibility
3. Document in COMPONENTS.md
```

### Step 7: TypeScript Strictness

Ensure all components pass strict TypeScript checks:

```bash
npm run lint
npx tsc --noEmit
```

Fix any type errors that emerged during migration.

### Step 8: Accessibility Audit

Test keyboard navigation:
- [ ] Tab through all interactive elements
- [ ] Test Select/Dropdown with keyboard
- [ ] Test DatePicker with keyboard
- [ ] Test forms with screen reader (if possible)

### Step 9: Create Migration Summary Report

Document what was migrated:

```markdown
# shadcn/ui Migration Summary

## Completed: [Date]

### Components Migrated

1. **DatePicker, TimePicker, DateTimeSelector**
   - Status: ✅ Fully migrated
   - Complexity: Low (were stubs)
   - Impact: High (production-ready date/time picking)

2. **Button**
   - Status: ✅ Fully migrated
   - Complexity: Low
   - Impact: High (used everywhere)
   - Custom variants maintained

3. **InputText**
   - Status: ✅ Fully migrated
   - Complexity: Low
   - Impact: High (forms throughout app)

4. **Card components (CourtCard, ProfileCard)**
   - Status: ✅ Enhanced with shadcn Card structure
   - Complexity: Medium
   - Impact: Medium (better consistency)

5. **FilterBar**
   - Status: ✅ Implemented with Select + Switch
   - Complexity: Medium
   - Impact: High (was placeholder)

6. **ProfileComplete**
   - Status: ✅ Migrated to react-hook-form + shadcn Form
   - Complexity: High
   - Impact: High (better validation)

7. **ChatRoomItem**
   - Status: ✅ Enhanced with Avatar + Badge
   - Complexity: Medium
   - Impact: Low (minor improvements)

8. **MessageItem**
   - Status: ⏭️ Kept custom (domain-specific)
   - Reason: Too specialized for migration

### Statistics

- Total components migrated: 7
- Custom components kept: 2 (MessageItem, IconLoader)
- New components added: 15+ (shadcn/ui library)
- Bundle size impact: +120KB (acceptable for features gained)
- Accessibility improvements: All migrated components

### Next Steps

- Monitor performance
- Gather user feedback
- Consider migrating feature-specific components
- Keep shadcn/ui components updated
```

### Phase 6 Checklist

- [ ] Remove old component files (.old.tsx)
- [ ] Clean up unused CSS variables
- [ ] Update all index.ts exports
- [ ] Run bundle size analysis
- [ ] Optimize large dependencies (date-fns, etc.)
- [ ] Document all components
- [ ] Update team guidelines
- [ ] Run TypeScript strict checks
- [ ] Perform accessibility audit
- [ ] Create migration summary report
- [ ] Celebrate! 🎉

**🎯 Success Criteria:**
- Clean codebase with no old files
- Documentation is up to date
- Team knows how to use new components
- No type errors
- Accessibility improved
- Bundle size is acceptable

**💡 What You Learned:**
- How to complete a large-scale migration
- Documentation best practices
- Team onboarding for new component library
- Optimization techniques

---

## Migration Checklist

### Pre-Migration
- [ ] Read and understand shadcn/ui philosophy
- [ ] Review current component inventory
- [ ] Identify stub vs. production components
- [ ] Get team buy-in
- [ ] Set up test environment

### Phase 0: Setup
- [ ] Install shadcn/ui via `npx shadcn@latest init`
- [ ] Verify configuration
- [ ] Test installation with dummy component
- [ ] Understand both old and new can coexist

### Phase 1: Stubs
- [ ] Migrate DatePicker
- [ ] Migrate TimePicker
- [ ] Migrate DateTimeSelector
- [ ] Test in real features

### Phase 2: Core Components
- [ ] Customize shadcn Button with design tokens
- [ ] Migrate or wrap Button
- [ ] Customize shadcn Input
- [ ] Migrate or wrap InputText
- [ ] Roll out gradually or all at once
- [ ] Test thoroughly

### Phase 3: Design Integration
- [ ] Map design tokens to shadcn variables
- [ ] Update index.css
- [ ] Update tailwind.config
- [ ] Test both token systems
- [ ] Document token mapping

### Phase 4: Cards
- [ ] Install Card component
- [ ] Enhance CourtCard
- [ ] Enhance ProfileCard
- [ ] Create reusable card patterns
- [ ] Apply to MatchCard

### Phase 5: Complex Components
- [ ] Implement FilterBar with Select + Switch
- [ ] Enhance ChatRoomItem with Badge
- [ ] Consider MessageItem (decide to keep custom)
- [ ] Migrate ProfileComplete to Form + validation
- [ ] Test complex user flows

### Phase 6: Cleanup
- [ ] Remove old files
- [ ] Clean up unused CSS
- [ ] Update exports
- [ ] Optimize bundle
- [ ] Document components
- [ ] Update guidelines
- [ ] Accessibility audit
- [ ] Create summary report

### Post-Migration
- [ ] Monitor for bugs
- [ ] Gather user feedback
- [ ] Plan future component additions
- [ ] Keep shadcn/ui updated

---

## Troubleshooting

### Issue: Tailwind classes not applying to shadcn components

**Solution:** Ensure `src/components/ui/` is in your Tailwind content config:

```javascript
// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",  // This should catch src/components/ui/
  ],
}
```

### Issue: Design tokens not working with shadcn components

**Solution:** Use the `cn()` utility and explicitly add your classes:

```tsx
<Button className={cn("bg-primary text-text-body", className)}>
  Click Me
</Button>
```

### Issue: DatePicker not opening on mobile

**Solution:** Ensure Popover has proper z-index and viewport meta tag:

```html
<!-- index.html -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
```

```css
/* index.css */
[data-radix-popper-content-wrapper] {
  z-index: 50 !important;
}
```

### Issue: Form validation not showing error messages

**Solution:** Ensure you're using FormMessage component:

```tsx
<FormField
  control={form.control}
  name="nickname"
  render={({ field }) => (
    <FormItem>
      <FormLabel>닉네임</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormMessage />  {/* This displays errors */}
    </FormItem>
  )}
/>
```

### Issue: Calendar not showing in Korean

**Solution:** Import and configure locale in date-fns:

```tsx
import { ko } from "date-fns/locale"
import { format } from "date-fns"

<Calendar
  mode="single"
  selected={date}
  onSelect={onDateChange}
  locale={ko}
/>

// Format dates in Korean
format(date, "PPP", { locale: ko })
```

### Issue: Bundle size increased significantly

**Solution:**
1. Use tree-shakeable imports
2. Remove unused shadcn components
3. Optimize date-fns imports
4. Consider code splitting

```tsx
// Instead of:
import { format, parse, isAfter } from "date-fns"

// Use:
import format from "date-fns/format"
import parse from "date-fns/parse"
import isAfter from "date-fns/isAfter"
```

### Issue: TypeScript errors after migration

**Solution:** Ensure types are correct and components are properly exported:

```bash
# Reinstall dependencies
rm -rf node_modules
npm install

# Clear TypeScript cache
npx tsc --build --clean
```

### Issue: shadcn CLI not finding configuration

**Solution:** Ensure `components.json` is at project root and properly formatted:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/index.css",
    "baseColor": "neutral"
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

---

## Resources

### Official Documentation
- [shadcn/ui Docs](https://ui.shadcn.com/)
- [Radix UI Docs](https://www.radix-ui.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [Class Variance Authority](https://cva.style/docs)

### Useful Tools
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) - VS Code extension
- [HSL Color Converter](https://htmlcolors.com/hex-to-hsl)
- [Accessibility Checker](https://www.accessibilitychecker.org/)
- [Bundle Analyzer](https://www.npmjs.com/package/vite-bundle-visualizer)

### shadcn/ui Component Examples
- [shadcn/ui Examples](https://ui.shadcn.com/examples)
- [shadcn/ui Blocks](https://ui.shadcn.com/blocks)

### Community
- [shadcn/ui GitHub](https://github.com/shadcn/ui)
- [shadcn/ui Discord](https://discord.com/invite/shadcn)

---

## Conclusion

This migration guide provides a **phased, incremental approach** to adopting shadcn/ui in your tennis web app. By starting with the easiest components (stubs) and gradually moving to more complex ones, your team will:

1. **Learn shadcn/ui progressively** without overwhelming complexity
2. **Maintain production stability** by migrating piece by piece
3. **Keep your design system** intact while gaining component library benefits
4. **Improve code quality** with accessible, well-tested components
5. **Reduce maintenance burden** on custom component code

Remember:
- ✅ Take your time - don't rush complex migrations
- ✅ Test thoroughly after each phase
- ✅ Document everything for your team
- ✅ Keep custom components where they add value
- ✅ Celebrate progress along the way!

Good luck with your migration! 🚀
