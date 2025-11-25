import {useParams} from "react-router-dom"

import {useProfile} from "@shared/hooks"
import {ImgLoader} from "@shared/components/atoms"
import {ProfileCard} from "@shared/components/molecules"

import {useMatchInfo} from "@features/match/hook/useMatchInfo.ts"
import {useCourtInfo} from "@features/match/hook/useCourtInfo.ts"
import {CourtCard} from "@shared/components/molecules/CourtCard.tsx"


export function MatchDetail() {
    const {matchId} = useParams()
    const {matchInfo, isLoading, error} = useMatchInfo(matchId)
    const {courtInfo, isLoading: isCourtLoading, error: isCourtError} = useCourtInfo(matchInfo?.courtId)
    const {profile, isLoading: isProfileLoading, error: isProfileError} = useProfile(matchInfo?.hostId)

    if (error || isCourtError || isProfileError || courtInfo === null || profile === null) {
        return <ImgLoader imgType={"404_error"} imgSize={"full"}/>
    }

    if (isLoading || isCourtLoading || isProfileLoading) {
        return <ImgLoader imgType={"loading"} imgSize={"full"}/>
    }

    return (
        <div className='flex flex-col gap-md'>
            <CourtCard courtInfo={courtInfo}/>
            <ProfileCard userProfile={profile}/>
            {matchInfo?.description}
        </div>
    )
}