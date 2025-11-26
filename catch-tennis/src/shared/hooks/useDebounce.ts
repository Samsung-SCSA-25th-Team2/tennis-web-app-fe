import { useState, useEffect } from "react"

export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        // Cancel the timer if the value changes (user types again) 
        // before the delay expires
        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])

    return debouncedValue
}