import FilterBar from "../features/match/matchSearch/FilterBar.tsx"
import MatchList from "../features/match/matchSearch/MatchList.tsx"
import {useState} from "react"
import {GameType} from "../shared/types/enums.ts"
import type {SortType, StatusType} from "../features/match/types.ts"


const Match = () => {
    const [gameType, setGameType] = useState<GameType>(GameType.MixedDoubles)
    const [sortType, setSortType] = useState<SortType>('latest')
    const [startDatetime, setStartDatetime] = useState<Date>(new Date(1763686800000))
    const [endDatetime, setEndDatetime] = useState<Date>(new Date(1793478550000))
    const [statusType, setStatusType] = useState<StatusType>('RECRUITING')

    return (
        <>
            <FilterBar />
            <MatchList
                gameType={gameType}
                sortType={sortType}
                startDatetime={startDatetime}
                endDatetime={endDatetime}
                status={statusType}
            />
        </>
    )
}

export default Match