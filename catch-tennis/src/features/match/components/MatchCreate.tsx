import {AskQuestion} from "@shared/components/molecules"

import {useMatchCreate} from "../hooks/useMatchCreate.ts"


export function MatchCreate() {
    const {
        question,
        selectedValue,
        setSelectedValue,
        handleNext,
        isSubmitting
    } = useMatchCreate()

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