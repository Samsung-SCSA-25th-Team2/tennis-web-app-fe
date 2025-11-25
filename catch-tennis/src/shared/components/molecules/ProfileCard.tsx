import {type HTMLAttributes} from "react"

import type {ProfileData} from "@shared/types/common.ts"
import {ImgLoader} from "@shared/components/atoms"
import {type Age, Gender, type Period} from "@shared/types"

interface ProfileCardProps extends HTMLAttributes<HTMLDivElement> {
    userProfile: ProfileData

}

export function ProfileCard({
    userProfile,
                            }: ProfileCardProps) {

    const getGenderLabel = (gender: Gender) => {
        switch (gender) {
            case "MALE":
                return "남자"
            case "FEMALE":
                return "여자"
            default:
                return "알 수 없음"
        }
    }

    const getPeriodLabel = (period: Period) => {
        switch (period) {
            case "ONE_YEAR":
                return "1년"
            case "TWO_YEARS":
                return "2년"
            case "THREE_YEARS":
                return "3년"
            case "OVER_FOUR_YEARS":
                return "4년 이상"
        }
    }

    const getAgeLabel = (age: Age) => {
        switch (age) {
            case "TWENTY":
                return "20대"
            case "THIRTY":
                return "30대"
            case "FORTY":
                return "40대"
            case "OVER_FIFTY":
                return "+50대"
        }
    }

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