import {useNavigate, useParams} from "react-router-dom"
import {differenceInCalendarDays} from "date-fns"

import {useAuth, useProfile} from "@shared/hooks"
import {GoogleMap, ImgLoader, Spinner} from "@shared/components/atoms"
import {ProfileCard, CourtCard} from "@shared/components/molecules"
import {getAgeLabel, getGametypeLabel, getPeriodLabel} from "@shared/utils/toLabel.ts"

import {useMatchInfo} from "@features/match/hook/useMatchInfo.ts"
import {useCourtInfo} from "@features/match/hook/useCourtInfo.ts"
import type {Age, Period} from "@shared/types"
import {Button} from "@shared/components/ui/button.tsx"
import {chatCreatePost} from "@features/match/api/matchApi.ts"


export function MatchDetail() {
    const navigate = useNavigate()

    const {matchId} = useParams()
    const {matchInfo, isLoading, error} = useMatchInfo(matchId)
    const {courtInfo, isLoading: isCourtLoading, error: isCourtError} = useCourtInfo(matchInfo?.courtId)
    const {profile, isLoading: isProfileLoading, error: isProfileError} = useProfile(matchInfo?.hostId)
    const {userStatus} = useAuth()

    const noMatchFound = !isLoading && matchInfo === null
    const noCourtInfo = matchInfo !== null && !isCourtLoading && courtInfo === null
    const noProfileInfo = matchInfo !== null && !isProfileLoading && profile === null

    if (error || isCourtError || isProfileError || noMatchFound || noCourtInfo || noProfileInfo) {
        return <ImgLoader imgType={"404_error"} imgSize={"full"}/>
    }

    if (
        isLoading ||
        isCourtLoading ||
        isProfileLoading ||
        matchInfo === null ||
        courtInfo === null ||
        profile === null
    ) {
        return (
            <div className="flex h-72 items-center justify-center">
                <Spinner size="lg" />
            </div>
        )
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

    const toPlayerCount = (men: number, women: number) => {
        const parts = []
        if (men > 0) {
            parts.push(`남 ${men}`)
        }
        if (women > 0) {
            parts.push(`여 ${women}`)
        }
        return parts.length > 0 ? parts.join(', ') : '미정'
    }

    const toAgeRange = (ageRange: Array<Age>) => {
        const ageRangeString = ageRange.map((item) => getAgeLabel(item))
        return ageRangeString.join(', ')
    }

    const toPeriodRange = (periodRange: Array<Period>) => {
        const periodRangeString = periodRange.map((item) => getPeriodLabel(item))
        return periodRangeString.join(', ')
    }

    const toFee = (fee: number) => {
        return `${fee.toLocaleString()}원`
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

    const startDate = new Date(matchInfo.startDateTime)
    const endDate = new Date(matchInfo.endDateTime)

    const infoItems = [
        {
            label: '일정',
            value: `${formatDate(startDate)} · ${formatTime(startDate)} - ${formatTime(endDate)}`,
            icon: '📅'
        },
        {
            label: '경기 유형',
            value: `${getGametypeLabel(matchInfo.gameType)} (${toPlayerCount(matchInfo.playerCountMen, matchInfo.playerCountWomen)})`,
            icon: '🎯'
        },
        {
            label: '실력',
            value: toPeriodRange(matchInfo.period),
            icon: '🎾'
        },
        {
            label: '연령대',
            value: toAgeRange(matchInfo.ageRange),
            icon: '👥'
        },
        {
            label: '참가비',
            value: toFee(matchInfo.fee),
            icon: '💰'
        }
    ]

    const toChat = async () => {
        try {
            const {chatRoomId} = await chatCreatePost({matchId:matchInfo.matchId})
            navigate(`/chat/${chatRoomId}`)
        } catch (error) {
            console.error(error)
            navigate('/error')
        }
    }

    return (
        <div className='flex flex-col gap-6 pb-24'>
            {/* 매치 정보 카드 */}
            <section className='rounded-3xl border border-border bg-surface shadow-sm'>
                <div className='space-y-6 p-6 md:p-8'>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-text-muted">
                                    다가오는 매치
                                </p>
                                <div className="mt-3 flex items-baseline gap-3">
                                    <span className="text-4xl font-bold text-text-title">
                                        {toDDay(startDate)}
                                    </span>
                                    <span className="text-sm text-text-body">
                                        {formatDate(startDate)}
                                    </span>
                                </div>
                            </div>
                            <span className={`text-xs px-3 py-1 rounded-full font-medium border ${getStatusColor(matchInfo.status)}`}>
                                {getStatusLabel(matchInfo.status)}
                            </span>
                        </div>

                        <div className="inline-flex items-center gap-3 rounded-full border border-border bg-surface px-4 py-1.5 text-sm font-medium text-text-title">
                            <span className="h-2 w-2 rounded-full bg-primary" aria-hidden/>
                            <span>{getGametypeLabel(matchInfo.gameType)}</span>
                            <span className="text-xs text-text-muted">
                                {toPlayerCount(matchInfo.playerCountMen, matchInfo.playerCountWomen)}
                            </span>
                        </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        {infoItems.map((item) => (
                            <div
                                key={item.label}
                                className="flex items-center gap-3 rounded-2xl border border-border/50 bg-surface px-4 py-3 shadow-sm"
                            >
                                <span className="text-lg">{item.icon}</span>
                                <div className="flex flex-col">
                                    <span className="text-xs uppercase tracking-wide text-text-muted">{item.label}</span>
                                    <span className="text-sm font-medium text-text-title">{item.value}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {matchInfo.description && (
                        <div className="rounded-2xl border border-border bg-surface p-4 text-sm leading-relaxed text-text-body whitespace-pre-wrap">
                            {matchInfo.description}
                        </div>
                    )}
                </div>
            </section>

            {/* 코트 정보 */}
            <section className='rounded-3xl border border-border bg-surface shadow-sm p-1'>
                <CourtCard courtInfo={courtInfo}/>
            </section>

            {/* 호스트 정보 */}
            <section className='rounded-3xl border border-border bg-surface shadow-sm p-1'>
                <ProfileCard userProfile={profile}/>
            </section>

            {/* 지도 */}
            <section className='rounded-3xl overflow-hidden border border-border shadow-sm'>
                <GoogleMap latitude={courtInfo.latitude} longitude={courtInfo.longitude}/>
            </section>

            {/* 채팅하기 버튼 */}
            {userStatus?.userId !== matchInfo.hostId && (
                <div className='sticky bottom-4 z-50'>
                    <div className="rounded-2xl border border-border bg-surface p-3 shadow-md">
                        <Button
                            size={'lg'}
                            onClick={toChat}
                            className="w-full"
                        >
                            채팅하기
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
