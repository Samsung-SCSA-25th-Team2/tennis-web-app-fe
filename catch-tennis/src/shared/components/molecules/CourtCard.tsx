import {type HTMLAttributes} from "react"

import {ImgLoader} from "@shared/components/atoms"
import type {CourtInfo} from "@features/match/common.ts"

interface CourtCardProps extends HTMLAttributes<HTMLDivElement> {
    courtInfo: CourtInfo
    selected?: boolean
}

export function CourtCard({
                              courtInfo,
                              selected = false,
    ...rest
                          }: CourtCardProps) {

    const baseStyle = "flex flex-col gap-sm rounded-md shadow-sm p-sm"

    const selectStyle = selected ?
        "border-primary bg-primary-bg border-md"
        : "border-border bg-surface border-sm"

    const style = `${baseStyle} ${selectStyle}`

    return (
        <div className={style} {...rest}>
            <ImgLoader imgType={'unknown'} unknownSrc={courtInfo.thumbnail} imgSize={'full'}/>
            <div className='flex flex-col justify-center'>
                <div className='text-heading-h2'>{courtInfo.name}</div>
                <div className='flex justify-betweentext-body'>
                    <span>{courtInfo.address}</span>
                </div>
            </div>
        </div>
    )
}