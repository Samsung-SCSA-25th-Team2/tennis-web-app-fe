import {api} from '@shared/api'
import type {CourtInfo, MatchInfo} from "@features/match/common.ts"

export async function getMatchInfo(matchId: number | string) {
    return api.get<MatchInfo>(
        '/v1/matches/' + matchId,
        {useJWT:true}
    )
}

export async function getCourtInfo(courtId: number | string) {
    return api.get<CourtInfo>(
        '/v1/tennis-courts/' + courtId,
        {useJWT:true}
    )
}