import {type HTMLAttributes, useState, useEffect} from "react"
import {useNavigate} from "react-router-dom"
import {differenceInCalendarDays} from "date-fns"

import {useGetApi} from "@shared/hooks"
import {getEarliestPeriodLabel, getGametypeLabel} from "@shared/utils/toLabel.ts"
import {getChatRoomCountByMatch} from "@features/chat/api/chatApi"

import {type MatchInfo, type CourtInfo} from "../common.ts"


export interface MatchCardProps extends HTMLAttributes<HTMLDivElement> {
    matchInfo: MatchInfo
}

export function MatchCard  ({
    matchInfo,
              }: MatchCardProps) {

    const navigate = useNavigate()
    const [chatRoomCount, setChatRoomCount] = useState<number>(0)

    const {data: courtInfo, loading, error} = useGetApi<CourtInfo>(
        `/v1/tennis-courts/${matchInfo.courtId}`
    )

    // 채팅방 개수 조회
    useEffect(() => {
        const fetchChatRoomCount = async () => {
            try {
                const response = await getChatRoomCountByMatch(matchInfo.matchId)
                setChatRoomCount(response.chatRoomCount)
            } catch (err) {
                console.error('Failed to fetch chat room count:', err)
                setChatRoomCount(0)
            }
        }
        fetchChatRoomCount()
    }, [matchInfo.matchId])

    if (loading) {
        return (<div className='text-caption'>로딩중...</div>)
    }

    if (courtInfo == null || error) {
        return (<div>COURT NOT FOUND</div>)
    }

    const toDDay = (date: Date) => {
        const startDatetime = new Date(date)
        const currentDate = new Date()
        const days = differenceInCalendarDays(startDatetime, currentDate)
        if (days === 0) return 'D-Day'
        return days > 0 ? `D-${days}` : `D+${Math.abs(days)}`
    }

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
        const normalizedStatus = status?.toUpperCase()
        return normalizedStatus === 'RECRUITING' || normalizedStatus === 'OPEN' ? '모집중' : '마감'
    }

    const getStatusColor = (status: string) => {
        const normalizedStatus = status?.toUpperCase()
        return normalizedStatus === 'RECRUITING' || normalizedStatus === 'OPEN'
            ? 'bg-success/20 text-success border-success/30'
            : 'bg-text-muted/20 text-text-muted border-text-muted/30'
    }

    const toMatchDetails = () => {
        navigate(`/match/${matchInfo.matchId}`)
    }

    const startDate = new Date(matchInfo.startDateTime)
    const endDate = new Date(matchInfo.endDateTime)

    // 모집 인원 포맷팅 (괄호 안에 표시)
    const formatPlayerCount = () => {
        const parts = []
        if (matchInfo.playerCountMen > 0) {
            parts.push(`남 ${matchInfo.playerCountMen}`)
        }
        if (matchInfo.playerCountWomen > 0) {
            parts.push(`여 ${matchInfo.playerCountWomen}`)
        }
        return parts.length > 0 ? `(${parts.join(', ')})` : ''
    }

    return (
        <div
            onClick={toMatchDetails}
            className="relative cursor-pointer w-full bg-gradient-to-r from-primary/15 to-primary/5 rounded-xl p-4 shadow-sm border border-primary/20 hover:shadow-md transition-all"
        >
            <div className="flex items-start gap-5">
                {/* 코트 이미지 */}
                <div className="flex-shrink-0 w-32 h-32 rounded-xl overflow-hidden shadow-md bg-surface">
                    {courtInfo.thumbnail ? (
                        <img
                            src={courtInfo.thumbnail}
                            alt={courtInfo.name}
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
                        <div className="w-full h-full bg-primary flex items-center justify-center">
                            <span className="text-2xl">🎾</span>
                        </div>
                    )}
                </div>

                {/* 매치 정보 */}
                <div className="flex-1 min-w-0">
                    <div className="mb-2">
                        <span className="text-lg font-bold text-text-title">
                            {toDDay(startDate)}
                        </span>
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
                        <div className="flex items-center gap-2 text-sm text-text-body">
                            <span className="text-base flex-shrink-0">📍</span>
                            <div className="min-w-0">
                                <span className="truncate block font-medium text-text-title">
                                    {courtInfo.name}
                                </span>
                                <span className="text-xs text-text-body block truncate">
                                    {courtInfo.address}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-text-body">
                            <span className="text-base">🎯</span>
                            <span>
                                <span className="font-bold text-text-title">
                                    {getGametypeLabel(matchInfo.gameType)}
                                </span>
                                {formatPlayerCount() && (
                                    <span className="ml-1 text-text-body">
                                        {formatPlayerCount()}
                                    </span>
                                )}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-text-body">
                            <span className="text-base">🎾</span>
                            <span>
                                {getEarliestPeriodLabel(matchInfo.period)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 상태 배지 (우측 상단) */}
            <div className="absolute top-4 right-4">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${getStatusColor(matchInfo.status)}`}>
                    {getStatusLabel(matchInfo.status)}
                </span>
            </div>

            {/* 채팅방 개수 (우측 하단) */}
            <div className="absolute bottom-4 right-4 flex items-center gap-1 text-xs text-text-muted">
                <span>💬</span>
                <span>{chatRoomCount}</span>
            </div>
        </div>
    )

}
