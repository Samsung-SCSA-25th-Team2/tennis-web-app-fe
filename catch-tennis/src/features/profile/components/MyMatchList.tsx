import {useState, useEffect, useRef, useCallback, type RefObject} from 'react'
import {useNavigate} from 'react-router-dom'
import {getMyMatches} from '../api/myMatchesApi'
import {getCourtInfo, toggleMatchStatus} from '@features/match/api/matchApi'
import type {MatchInfo, CourtInfo} from '@features/match/common'
import {getGametypeLabel} from '@shared/utils/toLabel'

interface MyMatchListProps {
    scrollContainerRef: RefObject<HTMLDivElement | null>
}

export function MyMatchList({scrollContainerRef}: MyMatchListProps) {
    const navigate = useNavigate()
    const [matches, setMatches] = useState<MatchInfo[]>([])
    const [courts, setCourts] = useState<Map<number, CourtInfo>>(new Map())
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [updatingStatus, setUpdatingStatus] = useState<number | null>(null)
    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [nextCursor, setNextCursor] = useState<string | null>(null)
    const [hasNext, setHasNext] = useState(false)

    const observer = useRef<IntersectionObserver>()
    const lastMatchElementRef = useRef<HTMLDivElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const handleStatusChange = async (matchId: number, currentStatus: 'OPEN' | 'CLOSED', desiredStatus: 'OPEN' | 'CLOSED') => {
        if (currentStatus === desiredStatus) {
            setOpenDropdownId(null)
            return
        }

        setUpdatingStatus(matchId)
        setOpenDropdownId(null)
        try {
            await toggleMatchStatus(matchId)
            setMatches(prevMatches =>
                prevMatches.map(m =>
                    m.matchId === matchId ? {...m, status: desiredStatus} : m
                )
            )
        } catch (err) {
            console.error('Failed to update match status:', err)
        } finally {
            setUpdatingStatus(null)
        }
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdownId(null)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const loadMore = useCallback(async () => {
        if (!hasNext || !nextCursor || loadingMore) return

        setLoadingMore(true)
        try {
            const response = await getMyMatches(nextCursor, 5)
            setMatches(prev => [...prev, ...response.matches])
            setNextCursor(response.nextCursor)
            setHasNext(response.hasNext)
        } catch (err) {
            console.error('Failed to load more matches:', err)
        } finally {
            setLoadingMore(false)
        }
    }, [hasNext, nextCursor, loadingMore])

    useEffect(() => {
        const fetchInitialMatches = async () => {
            try {
                setLoading(true)
                const response = await getMyMatches(undefined, 5)
                setMatches(response.matches)
                setNextCursor(response.nextCursor)
                setHasNext(response.hasNext)
            } catch (err) {
                console.error('Failed to fetch my matches:', err)
                setError('매치 목록을 불러오지 못했습니다.')
            } finally {
                setLoading(false)
            }
        }
        fetchInitialMatches()
    }, [])

    useEffect(() => {
        const fetchCourtInfos = async () => {
            const newCourts = new Map(courts)
            let isUpdated = false
            for (const match of matches) {
                if (match.courtId && !newCourts.has(match.courtId)) {
                    try {
                        const court = await getCourtInfo(match.courtId)
                        newCourts.set(match.courtId, court)
                        isUpdated = true
                    } catch (err) {
                        console.error(`Failed to fetch court ${match.courtId}:`, err)
                    }
                }
            }
            if (isUpdated) {
                setCourts(newCourts)
            }
        }

        if (matches.length > 0) {
            fetchCourtInfos()
        }
    }, [matches])

    useEffect(() => {
        if (loadingMore || !hasNext || !lastMatchElementRef.current || !scrollContainerRef.current) return

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            if (entries[0].isIntersecting) {
                loadMore()
            }
        }

        const observerInstance = new IntersectionObserver(observerCallback, {
            root: scrollContainerRef.current,
            rootMargin: '200px',
        })

        observerInstance.observe(lastMatchElementRef.current)
        observer.current = observerInstance

        return () => {
            observerInstance.disconnect()
        }
    }, [matches, hasNext, loadingMore, loadMore, scrollContainerRef])


    const formatDate = (date: Date) => {
        const d = new Date(date)
        return d.toLocaleDateString('ko-KR', {
            month: 'long',
            day: 'numeric',
            weekday: 'short'
        })
    }

    const formatTime = (date: Date) => {
        const d = new Date(date)
        return d.toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        })
    }

    const getStatusLabel = (status: string) => {
        return status === 'OPEN' ? '모집중' : '종료됨'
    }

    const getStatusColor = (status: string) => {
        return status === 'OPEN'
            ? 'bg-success/20 text-success border-success/30'
            : 'bg-text-muted/20 text-text-muted border-text-muted/30'
    }

    if (loading) {
        return (
            <div className="px-4 mt-6">
                <div className="bg-surface rounded-lg shadow-md p-5">
                    <h2 className="text-lg font-bold text-text-title mb-4">내가 만든 매치</h2>
                    <div className="space-y-3 animate-pulse">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="p-4 bg-background rounded-lg border border-border">
                                <div className="h-4 bg-border rounded w-1/3 mb-2"></div>
                                <div className="h-3 bg-border rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="px-4 mt-6">
                <div className="bg-surface rounded-lg shadow-md p-5">
                    <h2 className="text-lg font-bold text-text-title mb-4">내가 만든 매치</h2>
                    <p className="text-sm text-text-muted text-center py-4">{error}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="px-4 mt-6">
            <div className="bg-surface rounded-lg shadow-md p-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-text-title">내가 만든 매치</h2>
                    <span className="text-sm text-text-muted">{matches.length}개</span>
                </div>

                {matches.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-sm text-text-muted mb-3">아직 만든 매치가 없습니다</p>
                        <button
                            onClick={() => navigate('/match/create')}
                            className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:opacity-90 transition-opacity"
                        >
                            매치 만들기
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {matches.map((match, index) => {
                            const court = courts.get(match.courtId)
                            const startDate = new Date(match.startDateTime)
                            const endDate = new Date(match.endDateTime)
                            const isLastElement = matches.length === index + 1
                            const isUpdating = updatingStatus === match.matchId

                            return (
                                <div
                                    key={match.matchId}
                                    ref={isLastElement ? lastMatchElementRef : null}
                                    onClick={() => navigate(`/match/${match.matchId}`)}
                                    className="relative cursor-pointer w-full bg-gradient-to-r from-primary/15 to-primary/5 rounded-xl p-4 shadow-sm border border-primary/20 hover:shadow-md transition-all text-left"
                                >
                                    <div className="flex items-start gap-5">
                                        <div
                                            className="flex-shrink-0 w-32 h-32 rounded-xl overflow-hidden shadow-md bg-surface">
                                            {court?.thumbnail ? (
                                                <img
                                                    src={court.thumbnail}
                                                    alt={court.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement
                                                        target.style.display = 'none'
                                                        const parent = target.parentElement
                                                        if (parent) {
                                                            parent.classList.add('bg-primary', 'flex', 'items-center', 'justify-center')
                                                            parent.innerHTML = '<span class="text-2xl">🎾</span>'
                                                        }
                                                    }}
                                                />
                                            ) : (
                                                <div
                                                    className="w-full h-full bg-primary flex items-center justify-center">
                                                    <span className="text-2xl">🎾</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-base font-bold text-text-title">
                                                        {getGametypeLabel(match.gameType)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm text-text-body">
                                                    <span className="text-base">📅</span>
                                                    <span className="font-medium">
                                                        {formatDate(startDate)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-text-body">
                                                    <span className="text-base">⏰</span>
                                                    <span>
                                                        {formatTime(startDate)} - {formatTime(endDate)}
                                                    </span>
                                                </div>
                                                {court && (
                                                    <div className="flex items-center gap-2 text-sm text-text-body">
                                                        <span className="text-base flex-shrink-0">📍</span>

                                                        <div className="min-w-0">
                                                            <span
                                                                className="truncate block font-medium text-text-title">
                                                                {court.name}
                                                             </span>
                                                            <span className="text-xs text-text-body block truncate">
                                                                {court.address}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute top-4 right-4" ref={openDropdownId === match.matchId ? dropdownRef : null}>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setOpenDropdownId(openDropdownId === match.matchId ? null : match.matchId)
                                                }}
                                                disabled={isUpdating}
                                                className={`flex items-center text-xs px-2.5 py-1 rounded-full font-medium border transition-opacity ${getStatusColor(match.status)} disabled:opacity-50 disabled:cursor-not-allowed`}
                                            >
                                                <span>{getStatusLabel(match.status)}</span>
                                                <span className="ml-1.5 text-base">▼</span>
                                            </button>
                                            {isUpdating && (
                                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                            )}
                                        </div>
                                        {openDropdownId === match.matchId && (
                                            <div className="absolute right-0 mt-2 w-28 bg-white rounded-md shadow-lg z-10" onClick={e => e.stopPropagation()}>
                                                <ul className="py-1">
                                                    <li>
                                                        <a
                                                            href="#"
                                                            onClick={(e) => {
                                                                e.preventDefault()
                                                                handleStatusChange(match.matchId, match.status as 'OPEN' | 'CLOSED', 'OPEN')
                                                            }}
                                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        >
                                                            모집중
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a
                                                            href="#"
                                                            onClick={(e) => {
                                                                e.preventDefault()
                                                                handleStatusChange(match.matchId, match.status as 'OPEN' | 'CLOSED', 'CLOSED')
                                                            }}
                                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        >
                                                            종료됨
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}

                        {loadingMore && (
                            <div className="flex justify-center items-center p-4">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
