import {type HTMLAttributes} from "react"

import {ImgLoader} from "@shared/components/atoms"

import {type CourtInfo} from "../common.ts"


export interface CourtCardProps extends HTMLAttributes<HTMLDivElement> {
    courtInfo: CourtInfo
}

export function MatchCard  ({
    courtInfo,
              }: CourtCardProps) {

    // TODO: add onclick
    // TODO: add selected
    return (
        <div
            className="w-full flex rounded-sm shadow-sm bg-surface-raised border-border border-sm py-xs px-xs gap-sm"
        >
            <ImgLoader
                imgType={'unknown'}
                unknownSrc={courtInfo.thumbnail}
                unknownAlt='court thumbnail'
                imgSize={'large'}
            />
            <div className='flex flex-col w-full gap-xs justify-between'>
                <div className='flex justify-center text-text-title'>
                    <span className='text-heading-h2'>{courtInfo.name}</span>
                </div>
                <div className='flex justify-center text-body'>
                    <div>{courtInfo.address}</div>
                </div>
            </div>
        </div>
    )

}
