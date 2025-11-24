import {useParams} from "react-router-dom"

import {ProfileComplete} from "../components/ProfileComplete.tsx"

export function ProfileCompleteWrapper() {
    const {questionNumber} = useParams()

    return (
        <ProfileComplete key={questionNumber} />
    )
}
