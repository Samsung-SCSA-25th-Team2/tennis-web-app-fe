import {type HTMLAttributes} from "react"

import {ImgLoader} from "@shared/components/atoms"
import type {CourtInfo} from "@features/match/common.ts"

interface CourtCardProps extends HTMLAttributes<HTMLDivElement> {
    courtInfo: CourtInfo
}

export function CourtCard({
                                courtInfo,
                            }: CourtCardProps) {

    return (
        <div className="flex flex-col gap-sm border-border border-sm rounded-md shadow-sm bg-surface p-sm">
            <ImgLoader imgType={'unknown'} unknownSrc={courtInfo.thumbnail} imgSize={'full'}/>
            <div className='flex flex-col justify-center gap-sm'>
                <div className='text-heading-h2'>{courtInfo.name}</div>
                <div className='flex justify-betweentext-body'>
                    <span>{courtInfo.address}</span>
                </div>
            </div>
        </div>
    )
}