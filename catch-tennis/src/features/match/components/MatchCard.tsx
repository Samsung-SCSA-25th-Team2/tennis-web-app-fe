import {type HTMLAttributes} from "react"
import {differenceInCalendarDays, format} from "date-fns"
import {ko} from "date-fns/locale"

import {useGetApi} from "@shared/hooks"
import {ImgLoader} from "@shared/components/atoms"
import {getEarliestPeriodLabel, getGametypeLabel} from "@shared/utils/toLabel.ts"

import {type MatchInfo, type CourtInfo} from "../common.ts"
import {useNavigate} from "react-router-dom"


export interface MatchCardProps extends HTMLAttributes<HTMLDivElement> {
    matchInfo: MatchInfo
}

export function MatchCard  ({
    matchInfo,
              }: MatchCardProps) {

    const navigate = useNavigate()

    const {data: courtInfo, loading, error} = useGetApi<CourtInfo>(
        `/v1/tennis-courts/${matchInfo.courtId}`
    )

    if (loading) {
        return (<div className='text-caption'>로딩중...</div>)
    }

    if (courtInfo == null || error) {
        return (<div>COURT NOT FOUND</div>)
    }

    const toDDay = (d: Date) => {
        const startDatetime = new Date(d)
        const currentDate = new Date()
        const days = differenceInCalendarDays(startDatetime, currentDate)
        if (days === 0) return 'D-Day'
        return days > 0 ? `D-${days}` : `D+${Math.abs(days)}`
    }

    const formatStartDate = (date: Date) => format(date, "yyyy년 MM월 dd일 HH시", {locale: ko})
    const formatEndDate = (date: Date) => format(date, "HH시", {locale: ko})
    const formatDateRangeText = () => {
        return `${formatStartDate(matchInfo.startDateTime)} - ${formatEndDate(matchInfo.endDateTime).replace('00', '24')}`
    }

    const formatPlayerCount = () => {
        let ret = ''
        if (matchInfo.playerCountMen > 0) {
            ret = `남${matchInfo.playerCountMen}`
        }
        if (matchInfo.playerCountWomen > 0) {
            ret = ret + `여${matchInfo.playerCountWomen}`
        }
        return ret
    }

    const toMatchDetails = () => {
        navigate(`/match/${matchInfo.matchId}`)
    }

    return (
        <div
            className="w-full flex rounded-sm shadow-sm bg-surface-raised border-border border-sm py-xs px-xs gap-sm"
            onClick={toMatchDetails}
        >
            <ImgLoader
                imgType={'unknown'}
                unknownSrc={courtInfo.thumbnail}
                unknownAlt='court thumbnail'
                imgSize={'large'}
            />
            <div className='flex flex-col w-full gap-xs justify-between'>
                <div className='flex justify-between'>
                    <span className='text-heading-h2'>{courtInfo.name}</span>
                    <div>{matchInfo.status}</div>
                </div>
                <div className='flex justify-between text-body'>
                    <div>{toDDay(matchInfo.startDateTime)}</div>
                    <div>{formatDateRangeText()}</div>
                </div>
                <div className='flex justify-between text-body'>
                    <div>{getGametypeLabel(matchInfo.gameType)}({formatPlayerCount()})</div>
                    <div>{getEarliestPeriodLabel(matchInfo.period)}</div>
                </div>

            </div>
        </div>
    )

}
