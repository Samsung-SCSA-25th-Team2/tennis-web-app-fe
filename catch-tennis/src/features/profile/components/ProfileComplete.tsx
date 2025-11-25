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
                value={selectedValue}
                onChange={setSelectedValue}
                onNext={handleNext}
                isSubmitting={isSubmitting}
            />
    )
}
