import {useParams} from "react-router-dom"

import {MatchCreate} from "../components/MatchCreate.tsx"

export function MatchCreateWrapper() {
    const {questionNumber} = useParams()

    return (
        <MatchCreate key={questionNumber}/>
    )
}