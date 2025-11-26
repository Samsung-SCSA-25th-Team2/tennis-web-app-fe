import {useParams} from 'react-router-dom'

import {MatchCreate} from "@features/match/pages/MatchCreate.tsx"

export function MatchCreateWrapper() {
    const {questionNumber} = useParams<{questionNumber:string}>()
    return (
        <MatchCreate questionNumber={questionNumber ? questionNumber : "1"}/>
    )
}