import {useNavigate, useParams} from "react-router-dom"

import {useAuth, useProfile} from "@shared/hooks"
import {GoogleMap, ImgLoader} from "@shared/components/atoms"
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

    if (error || isCourtError || isProfileError || matchInfo === null || courtInfo === null || profile === null) {
        return <ImgLoader imgType={"404_error"} imgSize={"full"}/>
    }

    if (isLoading || isCourtLoading || isProfileLoading) {
        return <ImgLoader imgType={"loading"} imgSize={"full"}/>
    }

    const toDatetimeString = (start: Date, end: Date) => {
        start = new Date(start)
        end = new Date(end)
        const year = start.getFullYear()
        const month = start.getMonth() + 1
        const day = start.getDate()
        const startHour = start.getHours()
        const endHour = end.getHours() === 0 ? 24 : end.getHours()

        return `${year}년 ${month}월 ${day}일 ${startHour}~${endHour}시`
    }

    const toPlayerCount = (men: number, women: number) => {
        let ret = ''
        if (men != 0) {
            ret = ret.concat(`남${men}`)
        }
        if (women != 0) {
           ret = ret.concat(`여${women}`)
        }
        return ret
    }

    const toAgeRange = (ageRange: Array<Age>) => {
        const ageRangeString = ageRange.map((item) => getAgeLabel(item))
        return ageRangeString.join(',')
    }

    const toPeriodRange = (periodRange: Array<Period>) => {
        const periodRangeString = periodRange.map((item) => getPeriodLabel(item))
        return periodRangeString.join(',')
    }

    const toFee = (fee: number) => {
        return `${fee.toLocaleString()}원`
    }

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
        <div className='flex flex-col gap-md'>
            {/* 뒤로가기 버튼 */}
            <div className="flex items-center gap-3 pb-2">
                <button
                    onClick={() => navigate(-1)}
                    className="text-text-title text-xl hover:opacity-70 transition-opacity"
                >
                    ←
                </button>
                <h2 className="text-heading-h2 font-bold text-text-title">매치 상세</h2>
            </div>

            <div className='flex flex-col gap-md'>
                <CourtCard courtInfo={courtInfo}/>
                <ProfileCard userProfile={profile}/>
            </div>
            <div className='flex flex-col gap-xs'>
                <div className='flex items-start'>
                    <span className='text-heading-h2 w-[30%] text-left'>일시</span>
                    <span className='text-heading-h3'>{toDatetimeString(matchInfo.startDateTime, matchInfo.endDateTime)}</span>
                </div>
                <div className='flex items-start'>
                    <span className='text-heading-h2 w-[30%] text-left'>게임유형</span>
                    <span className='text-heading-h3'>{getGametypeLabel(matchInfo.gameType)}</span>
                </div>
                <div className='flex items-start'>
                    <span className='text-heading-h2 w-[30%]'>모집인원</span>
                    <span className='text-heading-h3'>{toPlayerCount(matchInfo.playerCountMen, matchInfo.playerCountWomen)}</span>
                </div>
                <div className='flex items-start'>
                    <span className='text-heading-h2 w-[30%]'>연령대</span>
                    <span className='text-heading-h3'>{toAgeRange(matchInfo.ageRange)}</span>
                </div>
                <div className='flex items-start'>
                    <span className='text-heading-h2 w-[30%]'>구력</span>
                    <span className='text-heading-h3'>{toPeriodRange(matchInfo.period)}</span>
                </div>
                <div className='flex items-start'>
                    <span className='text-heading-h2 w-[30%]'>참가비</span>
                    <span className='text-heading-h3'>{toFee(matchInfo.fee)}</span>
                </div>
            </div>
            <div className='text-body pb-lg'>
                {matchInfo.description}
            </div>
            <>
                <GoogleMap latitude={courtInfo.latitude} longitude={courtInfo.longitude}/>
            </>
            {
                userStatus?.userId !== matchInfo.hostId ?
                <div
                    className='flex w-full justify-end sticky bottom-0 z-50'
                >
                    <Button
                        size={'lg'}
                        onClick={toChat}
                    >채팅하기</Button>
                </div> : <></>
            }
        </div>
    )
}