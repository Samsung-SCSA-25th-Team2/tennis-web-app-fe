import {useEffect, useState} from "react"
import {useNavigate, useSearchParams} from "react-router-dom"
import type { DateRange } from "react-day-picker"

import { GameType } from "@shared/types"
import type { TimeRange } from "@shared/types/common.ts"

import { FilterBar } from "../components/FilterBar.tsx"
import { MatchList } from "../components/MatchList.tsx"
import type { SortType, StatusType } from "../common.ts"
import {Button} from "@shared/components/ui/button.tsx"
import {useGeolocation} from "@shared/hooks"
import {LocationPermissionPrompt} from "@shared/components/molecules"


export function Match() {
    const {coordinates, loading, permission, hasLocation, requestLocation} = useGeolocation()
    const [showPrompt, setShowPrompt] = useState(false)
    const [dismissedForSortType, setDismissedForSortType] = useState<SortType | null>(null)
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()

    const sortType = (searchParams.get("sortType") as SortType) || "latest"

    // Derive promptDismissed: only dismissed if user dismissed for this specific sortType
    const promptDismissed = dismissedForSortType === sortType

    // Save coordinates to localStorage when available and sortType starts with 'loc'
    useEffect(() => {
        if (coordinates && sortType.startsWith('loc')) {
            localStorage.setItem('catch-tennis-lat', coordinates.latitude.toString())
            localStorage.setItem('catch-tennis-lng', coordinates.longitude.toString())
        }
    }, [coordinates, sortType])

    // Request location when user selects location-based sorting
    useEffect(() => {
        if (sortType.startsWith('loc') && !hasLocation && permission === 'granted') {
            requestLocation()
        }
    }, [sortType, hasLocation, permission, requestLocation])

    // Show location prompt for location-based sorting
    useEffect(() => {
        console.log(`permission: ${permission}, sortType: ${sortType}`)
        console.log(`promptDismissed: ${promptDismissed}, hasLocation: ${hasLocation}`)
        if (sortType.startsWith('loc') && permission === 'prompt' && !promptDismissed && !hasLocation) {
            const timer = setTimeout(()=>setShowPrompt(true), 1)
            return () => clearTimeout(timer)
        }
    }, [permission, hasLocation, sortType, promptDismissed])

    const handleRequestLocation = async () => {
        await requestLocation()
        setShowPrompt(false)
    }

    const handleDismissPrompt = () => {
        setShowPrompt(false)
        setDismissedForSortType(sortType)
    }

    const gameType = (searchParams.get("gameType") as GameType) || GameType.Singles
    const statusType = (searchParams.get("statusType") as StatusType) || "RECRUITING"

    const dateRange: DateRange = {
        from: searchParams.get("from") ? new Date(searchParams.get("from")!) : new Date(),
        to: searchParams.get("to") ? new Date(searchParams.get("to")!) : new Date(),
    }

    const timeRange: TimeRange = {
        start: Number(searchParams.get("start") ?? 0),
        end: Number(searchParams.get("end") ?? 24),
    }

    // update URL
    const updateFilter = (key: string, value: string | number | undefined) => {
        setSearchParams((prev) => {
            if (value === undefined || value === null) {
                prev.delete(key)
            } else {
                prev.set(key, String(value))
            }
            return prev
        })
    }

    // URL handlers
    const handleDateRangeChange = (range: DateRange | undefined) => {
        setSearchParams((prev) => {
            if (range?.from) prev.set("from", range.from.toISOString())
            if (range?.to) prev.set("to", range.to.toISOString())
            return prev
        })
    }

    const handleTimeRangeChange = (range: TimeRange) => {
        setSearchParams((prev) => {
            prev.set("start", String(range.start))
            prev.set("end", String(range.end))
            return prev
        })
    }

    const toMatchCreate = () => {
        navigate('/match/create')
    }

    return (
        <div className='flex flex-col gap-md'>
            <div className='sticky top-0 z-10 bg-surface pb-sm border-border border-b-sm'>
                <FilterBar
                    gameType={gameType}
                    onGameTypeChange={(val) => updateFilter("gameType", val)}
                    sortType={sortType}
                    onSortTypeChange={(val) => updateFilter("sortType", val)}
                    dateRange={dateRange}
                    onDateRangeChange={handleDateRangeChange}
                    timeRange={timeRange}
                    onTimeRangeChange={handleTimeRangeChange}
                    statusType={statusType}
                    onStatusTypeChange={(val) => updateFilter("statusType", val)}
                />
            </div>

            {showPrompt && (
                <div className='px-md'>
                    <LocationPermissionPrompt
                        onRequestPermission={handleRequestLocation}
                        onDismiss={handleDismissPrompt}
                        loading={loading}
                    />
                </div>
            )}

            <div className='flex-1 overflow-y-auto min-h-0 scrollbar-hide'>
                <MatchList
                    gameType={gameType}
                    sortType={sortType}
                    dateRange={dateRange}
                    timeRange={timeRange}
                    statusType={statusType}
                />
            </div>
            <div
                className='flex w-full justify-end sticky bottom-0 z-50'
            >
                <Button
                    size={'lg'}
                    onClick={toMatchCreate}
                >글쓰기</Button>
            </div>
        </div>
    )
}