import {type HTMLAttributes} from "react"

import type {ProfileData} from "@shared/types/common.ts"
import {ImgLoader} from "@shared/components/atoms"
import {getGenderLabel, getPeriodLabel, getAgeLabel} from "@shared/utils/toLabel.ts"

interface ProfileCardProps extends HTMLAttributes<HTMLDivElement> {
    userProfile: ProfileData

}

export function ProfileCard({
    userProfile,
                            }: ProfileCardProps) {



    return (
        <div className="flex gap-lg border-border border-sm rounded-md shadow-sm bg-surface p-sm">
            <ImgLoader imgType={'unknown'} unknownSrc={userProfile.imgUrl} imgSize={'large'}/>
            <div className='flex flex-col justify-center gap-sm'>
                <div className='text-heading-h2'>{userProfile.nickname}</div>
                <div className='flex justify-betweentext-body'>
                    <span>{getGenderLabel(userProfile.gender)}</span>
                    <span>{getPeriodLabel(userProfile.period)}</span>
                    <span>{getAgeLabel(userProfile.age)}</span>
                </div>
            </div>
        </div>
    )
}