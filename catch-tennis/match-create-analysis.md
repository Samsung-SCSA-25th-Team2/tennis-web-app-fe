# Match Creation Form Analysis & Solutions

## Current Architecture Issues

### Problem 1: Count Component State Isolation
**File:** `src/shared/components/atoms/Count.tsx:13`

```tsx
const [count, setCount] = useState(0)  // ❌ Internal state
```

- Count component manages its own state
- Parent component cannot access the count values
- `value` prop is received but never used
- **Result:** `playerCountMen` and `playerCountWomen` cannot be collected

### Problem 2: Single String Value Limitation
**File:** `src/features/match/hooks/useMatchCreate.ts:14`

```tsx
const [selectedValue, setSelectedValue] = useState(() => { ... })
```

- Current type: `string`
- API needs:
  - `playerCount` page: **2 numbers** (men + women)
  - `ageRange`: **string[]** (array)
  - `period`: **string[]** (array)

### Problem 3: API Mapping Mismatch

**Questions collected:**
- `courtId`, `datetime`, `level`, `gameType`, `playerCount`, `age`, `fee`, `description`

**API expects:**
- `courtId` (number), `startDateTime`, `endDateTime`, `gameType`, `period[]`, `playerCountMen`, `playerCountWomen`, `ageRange[]`, `fee` (number), `description`

**Mismatches:**
1. `datetime` → needs splitting into `startDateTime` + `endDateTime`
2. `level` → maps to `period[]` (array)
3. `playerCount` → needs splitting into `playerCountMen` + `playerCountWomen`
4. `age` → maps to `ageRange[]` (array)

---

## Solution Options

### Option A: JSON String Storage (Quick Fix)
**Pros:** Minimal changes to existing architecture
**Cons:** Type-unsafe, hacky

For `playerCount` question, store as JSON string:
```tsx
// In AskQuestion.tsx for 'count' type
const handleCountChange = (label: string, value: number) => {
  const current = JSON.parse(selectedValue || '{}')
  current[label] = value
  setSelectedValue(JSON.stringify(current))
}

// Usage: '{"남자": 2, "여자": 1}'
```

### Option B: Restructure Answer Storage (Recommended)
**Pros:** Type-safe, scalable, clean
**Cons:** Requires more refactoring

#### Step 1: Change Answer Storage Type

```tsx
// src/shared/types/common.ts
export interface AnswersState {
  courtId?: string
  datetime?: string
  level?: string[]          // Array for multi-select
  gameType?: string
  playerCount?: {
    men: number
    women: number
  }
  age?: string[]            // Array for multi-select
  fee?: string
  description?: string
}
```

#### Step 2: Make Count Component Controlled

```tsx
// src/shared/components/atoms/Count.tsx
interface CountProps {
  label: string
  value: number              // Actually use this!
  onChange: (value: number) => void  // Lift state up
}

export function Count({ label, value, onChange }: CountProps) {
  const maxVal = 10
  const minVal = 0

  const onClickPlus = () => {
    const newCount = Math.min(value + 1, maxVal)
    onChange(newCount)
  }

  const onClickMinus = () => {
    const newCount = Math.max(value - 1, minVal)
    onChange(newCount)
  }

  return (
    <div className='flex w-full justify-between items-center py-sm px-md gap-md bg-surface border-border border-sm rounded-sm'>
      <span className='text-heading-h4'>{label}</span>
      <div className='flex justify-center items-center gap-md'>
        <Button variant={value === maxVal ? 'inactive' : 'primary'} buttonSize={'xs'} onClick={onClickPlus}>+</Button>
        <span className='w-5 text-center'>{value}</span>
        <Button variant={value === minVal ? 'inactive' : 'primary'} buttonSize={'xs'} onClick={onClickMinus}>-</Button>
      </div>
    </div>
  )
}
```

#### Step 3: Update AskQuestion for Multiple Counts

```tsx
// src/shared/components/molecules/AskQuestion.tsx
interface AskQuestionProps {
  question: Question
  selectedValue: string | string[] | Record<string, number>  // Union type
  setSelectedValue: (value: any) => void
  clickHandler: () => void
  isSubmitting: boolean
}

// In the count type handler (line 61):
else if (question.type === 'count' && question.options) {
  const counts = (selectedValue as Record<string, number>) || {}

  questionElem = (
    <div className='flex flex-col w-full px-xl gap-sm'>
      {question.options.map((option) => (
        <Count
          key={option.value}
          label={option.label}
          value={counts[option.value] || 0}
          onChange={(newValue) => {
            const updated = { ...counts, [option.value]: newValue }
            setSelectedValue(updated)
          }}
        />
      ))}
    </div>
  )
}

// Update submit button logic (line 82)
const hasValue = () => {
  if (typeof selectedValue === 'string') return selectedValue.length > 0
  if (Array.isArray(selectedValue)) return selectedValue.length > 0
  if (typeof selectedValue === 'object') return Object.keys(selectedValue).length > 0
  return false
}

<Button
  variant={hasValue() ? 'primary' : 'inactive'}
  disabled={!hasValue() || isSubmitting}
  ...
>
```

#### Step 4: Update Storage Utils

```tsx
// src/features/match/utils/storage.ts
export const storage = {
  getAnswers(): AnswersState {
    const saved = localStorage.getItem('matchCreateAnswers')
    return saved ? JSON.parse(saved) : {}
  },

  setAnswer(questionId: string, value: any) {
    const answers = this.getAnswers()
    answers[questionId] = value
    localStorage.setItem('matchCreateAnswers', JSON.stringify(answers))
  },

  clearAnswers() {
    localStorage.removeItem('matchCreateAnswers')
  }
}
```

#### Step 5: Update useMatchCreate Hook

```tsx
// src/features/match/hooks/useMatchCreate.ts
const [selectedValue, setSelectedValue] = useState<any>(() => {
  if (!question) return ''
  const savedAnswers = storage.getAnswers()
  const saved = savedAnswers[question.id]

  // Return appropriate default based on question type
  if (question.type === 'count') return {}
  if (question.type === 'button' && question.id === 'age') return []
  return saved || ''
})

// In handleNext (line 26)
const handleNext = async () => {
  // Validation based on type
  const isEmpty = () => {
    if (typeof selectedValue === 'string') return !selectedValue.trim()
    if (Array.isArray(selectedValue)) return selectedValue.length === 0
    if (typeof selectedValue === 'object') return Object.keys(selectedValue).length === 0
    return true
  }

  if (isEmpty()) return

  storage.setAnswer(question.id, selectedValue)

  if (questionIndex < questions.length - 1) {
    navigate(`/match-create/${questionIndex + 2}`)
  } else {
    setIsSubmitting(true)
    try {
      const answers = storage.getAnswers()

      // Transform to API format
      const payload = {
        courtId: parseInt(answers.courtId || '0'),
        startDateTime: answers.datetime || '',
        endDateTime: answers.datetime || '',  // TODO: Split properly
        gameType: answers.gameType || '',
        period: Array.isArray(answers.level) ? answers.level : [answers.level],
        playerCountMen: answers.playerCount?.men || 0,
        playerCountWomen: answers.playerCount?.women || 0,
        ageRange: answers.age || [],
        fee: parseInt(answers.fee || '0'),
        description: answers.description || ''
      }

      // await postMatch(payload)
      storage.clearAnswers()
      navigate('/match')
    } catch (error) {
      console.log('MatchCreateError:', error)
      navigate('/error')
    } finally {
      setIsSubmitting(false)
    }
  }
}
```

#### Step 6: Update Questions Config

```tsx
// src/features/match/utils/questions.ts

// For playerCount (line 41) - use actual keys that match Gender enum
{
  id: 'playerCount',
  heading: '모집 인원을 작성해 주세요',
  type: "count",
  options: [
    {label: '남자', value: 'male'},     // Use simple string keys
    {label: '여자', value: 'female'},
  ]
}

// For age - enable multi-select (need to implement in AskQuestion)
{
  id: 'age',
  heading: '모집 연령대를 선택해 주세요(복수 선택 가능)',
  type: "button",
  multiSelect: true,  // Add this flag
  options: [ ... ]
}
```

---

## Best Practice Recommendation

### **Option B is the best practice** because:

1. **Type Safety**: Proper TypeScript types for different answer formats
2. **Controlled Components**: Count component receives value/onChange (React best practice)
3. **Scalability**: Easy to add new question types
4. **Maintainability**: Clear data flow, no JSON string parsing
5. **Testability**: Predictable state management

### Implementation Priority

1. **High Priority**:
   - Fix Count.tsx to be controlled (Step 2)
   - Update playerCount question to store `{men: number, women: number}` (Steps 3-4)

2. **Medium Priority**:
   - Add multi-select support for age question
   - Implement proper datetime splitting

3. **Low Priority**:
   - Refactor storage to use structured types
   - Add validation per question type

---

## Quick Start: Minimal Changes

If you need to ship fast, do this:

1. **Fix Count.tsx** (make it controlled)
2. **For playerCount question only**: Use object storage
3. **Keep other questions as strings**
4. **Transform data in handleNext** before API call

This hybrid approach requires minimal refactoring while fixing the immediate blocker.

---

## Additional Considerations

### Multi-select for Age Question
Current heading says "복수 선택 가능" but implementation is single-select.

```tsx
// In AskQuestion for button type with multi-select
if (question.type === 'button' && question.options) {
  const values = question.multiSelect
    ? (selectedValue as string[] || [])
    : selectedValue as string

  questionElem = (
    <div className="flex gap-sm">
      {question.options.map((option) => {
        const isSelected = question.multiSelect
          ? (values as string[]).includes(option.value)
          : values === option.value

        return (
          <Button
            variant={isSelected ? 'primary' : 'inactive'}
            buttonSize='sm'
            key={option.value}
            onClick={() => {
              if (question.multiSelect) {
                const current = values as string[]
                const updated = current.includes(option.value)
                  ? current.filter(v => v !== option.value)
                  : [...current, option.value]
                setSelectedValue(updated)
              } else {
                setSelectedValue(option.value)
              }
            }}
          >
            {option.label}
          </Button>
        )
      })}
    </div>
  )
}
```

### Type Definition Update

```tsx
// src/shared/types/common.ts
export interface Question {
  id: string
  heading: string
  type: QuestionType
  options?: ButtonOption[]
  placeholder?: string
  multiSelect?: boolean  // Add this for multi-select buttons
}
```

---

## Summary

**Current Issue**: Count component doesn't communicate with parent, can't collect multiple values on one page.

**Solution**: Make Count controlled, restructure answer storage to support objects/arrays, transform data before API submission.

**Best Practice**: Option B with proper TypeScript types and controlled components.

**Quick Fix**: Option A with JSON strings if time-constrained (not recommended long-term).
