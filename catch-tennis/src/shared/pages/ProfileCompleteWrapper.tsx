import ProfileComplete from "../../features/profileComplete/ProfileComplete.tsx"
import {useParams} from "react-router-dom"

const ProfileCompleteWrapper = () => {
    const {questionNumber} = useParams()
    return (
        <ProfileComplete key={questionNumber} />
    )

}

export default ProfileCompleteWrapper