import {type Age, GameType, type Period} from "./enums.ts"
import type {StatusType} from "../../features/match/types.ts"

export interface MatchInfo {
    matchId: number,
    hostId: number,
    startDateTime: Date,
    endDateTime: Date,
    gameType: GameType,
    courtId : number,
    period: Array<Period>,
    playerCountMen: number,
    playerCountWomen: number,
    ageRange: Array<Age>,
    fee: number,
    description: string,
    status: StatusType,
    createdAt: Date,
    updatedAt: Date,
}
