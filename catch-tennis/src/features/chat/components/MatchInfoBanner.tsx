import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {getMatchInfo} from '@features/match/api/matchApi'
import {getCourtInfo} from '@features/match/api/matchApi'
import type {MatchInfo, CourtInfo} from '@features/match/common'
import {getGametypeLabel} from '@shared/utils/toLabel'

interface MatchInfoBannerProps {
    matchId: number
}

/**
 * 채팅방 상단에 매치 정보를 표시하는 배너 컴포넌트
 */
export function MatchInfoBanner({matchId}: MatchInfoBannerProps) {
    const navigate = useNavigate()
    const [matchInfo, setMatchInfo] = useState<MatchInfo | null>(null)
    const [courtInfo, setCourtInfo] = useState<CourtInfo | null>(null)
    const [loading, setLoading] = useState(true)
    const [isExpanded, setIsExpanded] = useState(true) // 토글 상태

    // 매치 상세 페이지로 이동
    const handleNavigateToMatch = () => {
        navigate(`/match/${matchId}`)
    }

    useEffect(() => {
        const fetchMatchInfo = async () => {
            try {
                setLoading(true)
                const match = await getMatchInfo(matchId)
                setMatchInfo(match)

                // 매치 정보를 가져온 후 코트 정보도 가져오기
                if (match.courtId) {
                    const court = await getCourtInfo(match.courtId)
                    setCourtInfo(court)
                }
            } catch (error) {
                console.error('Failed to fetch match info:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchMatchInfo()
    }, [matchId])

    if (loading) {
        return (
            <div className="p-4 bg-surface border-b border-border">
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-4 border border-primary/20">
                    <div className="flex items-start gap-3 animate-pulse">
                        <div className="flex-shrink-0 w-16 h-16 bg-primary/20 rounded-xl"></div>
                        <div className="flex-1 space-y-3">
                            <div className="h-5 bg-primary/20 rounded w-1/2"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-primary/15 rounded w-3/4"></div>
                                <div className="h-4 bg-primary/15 rounded w-2/3"></div>
                                <div className="h-4 bg-primary/15 rounded w-4/5"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (!matchInfo) {
        return null
    }

    // 날짜와 시간 포맷팅
    const startDate = new Date(matchInfo.startDateTime)
    const endDate = new Date(matchInfo.endDateTime)

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('ko-KR', {
            month: 'long',
            day: 'numeric',
            weekday: 'short'
        })
    }

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        })
    }

    return (
        <div className="p-4 bg-surface border-b border-border">
            {/* 카드 형태의 매치 정보 */}
            <div className="bg-gradient-to-r from-primary/15 to-primary/5 rounded-xl shadow-sm border border-primary/20">
                {/* 헤더 (항상 표시) */}
                <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-base font-bold text-text-title">
                            {getGametypeLabel(matchInfo.gameType)}
                        </span>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            matchInfo.status === 'RECRUITING'
                                ? 'bg-success/20 text-success border border-success/30'
                                : 'bg-text-muted/20 text-text-muted border border-text-muted/30'
                        }`}>
                            {matchInfo.status === 'RECRUITING' ? '모집중' : '종료'}
                        </span>
                    </div>

                    {/* 버튼 그룹 */}
                    <div className="flex items-center gap-3">
                        {/* 상세보기 버튼 */}
                        <button
                            onClick={handleNavigateToMatch}
                            className="text-xs px-3 py-1.5 bg-neutral-300 text-text-body rounded-full hover:opacity-90 transition-opacity font-medium"
                        >
                            상세보기
                        </button>

                        {/* 토글 버튼 */}
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="p-1.5 hover:bg-primary/10 rounded-full transition-colors"
                        >
                            <span className={`text-text-muted text-sm transition-transform inline-block ${isExpanded ? 'rotate-180' : ''}`}>
                                ▼
                            </span>
                        </button>
                    </div>
                </div>

                {/* 상세 정보 (토글 가능) */}
                {isExpanded && (
                    <div className="px-4 pb-4">
                        <div className="flex items-start gap-6">
                    {/* 코트 썸네일 이미지 */}
                    <div className="flex-shrink-0 w-30 h-30 rounded-xl overflow-hidden shadow-md bg-surface">
                        {courtInfo?.thumbnail ? (
                            <img
                                src={courtInfo.thumbnail}
                                alt={courtInfo.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    // 이미지 로드 실패 시 테니스 공 아이콘 표시
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
                            <div className="w-full h-full bg-primary flex items-center justify-center">
                                <span className="text-2xl">🎾</span>
                            </div>
                        )}
                    </div>

                    {/* 매치 정보 */}
                    <div className="flex-1 min-w-0">
                        {/* 상세 정보 */}
                        <div className="space-y-1.5">
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
                            {courtInfo && (
                                <div className="flex items-center gap-2 text-sm text-text-body">
                                    <span className="text-base flex-shrink-0">📍</span>

                                    <div className="min-w-0">
                                        {/* Name: font-medium과 block 클래스로 줄바꿈 및 강조 */}
                                        <span className="truncate block font-medium text-text-title">
                                            {courtInfo.name}
                                        </span>

                                        {/* Address: block 클래스로 name 아래에 줄바꿈되어 표시 */}
                                        <span className="text-xs text-text-body block truncate">
                                            {courtInfo.address}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                    </div>
                )}
            </div>
        </div>
    )
}