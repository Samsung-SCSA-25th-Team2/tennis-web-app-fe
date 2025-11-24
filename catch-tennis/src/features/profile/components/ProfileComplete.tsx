import {AskQuestion} from "@shared/components/molecules"

import {useCompleteProfile} from "../hooks/useCompleteProfile.tsx"


export function ProfileComplete() {
    const {
        question,
        selectedValue,
        setSelectedValue,
        handleNext,
        isSubmitting
    } = useCompleteProfile()

    return (
            <AskQuestion 
                question={question} 
                selectedValue={selectedValue} 
                setSelectedValue={setSelectedValue} 
                clickHandler={handleNext} 
                isSubmitting={isSubmitting}
            />
    )
}
