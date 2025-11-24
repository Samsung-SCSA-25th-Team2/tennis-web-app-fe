import {type HTMLAttributes} from "react"

import {useGetApi} from "@shared/hooks"
import {ImgLoader} from "@shared/components/atoms"

import {type MatchInfo, type CourtInfo} from "../common.ts"

export interface MatchCardProps extends HTMLAttributes<HTMLDivElement> {
    matchInfo: MatchInfo
}

export function MatchCard  ({
    matchInfo,
    ...rest
              }: MatchCardProps) {

    console.log(matchInfo)
    console.log(rest)

    const {data, loading, error} = useGetApi<CourtInfo>(
        `/v1/tennis-courts/${matchInfo.courtId}`
    )

    if (data == null) {
        return (<div>COURT NOT FOUND</div>)
    }

    console.log(`${JSON.stringify(data)} ${loading} ${error}`)

    return (
        <div className="w-full flex bg-surface border-border border-sm">
            <ImgLoader
                imgType={'unknown'}
                unknownSrc={data.thumbnail}
                unknownAlt='court thumbnail'
                imgSize={'medium'}
            />
            MATCH CARD
        </div>
    )

}
