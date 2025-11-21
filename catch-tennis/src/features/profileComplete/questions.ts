import type {Question} from "./types.ts"
import {Period, Gender, Age} from "../../shared/types/enums.ts"

export const questions: Question[] = [
    {
        id: 'nickname',
        heading: '앱에서 사용할 별명을 등록해 주세요',
        type: 'input',
        placeholder: '별명 입력'
    },
    {
        id: 'period',
        heading: '테니스는 얼마나 치셨나요?',
        type: 'button',
        options: [
            {label: '1년', value: Period.OneYear},
            {label: '2년', value: Period.TwoYears},
            {label: '3년', value: Period.ThreeYears},
            {label: '+4년', value: Period.OverFourYears},
        ]
    },
    {
        id: 'gender',
        heading: '성별이 어떻게 되시나요?',
        type: "button",
        options: [
            {label: '남자', value: Gender.Male},
            {label: '여자', value: Gender.Female},
        ]
    },
    {
        id: 'age',
        heading: '나이가 어떻게 되시나요?',
        type: "button",
        options: [
            {label: '20대', value: Age.Twenty},
            {label: '30대', value: Age.Thirty},
            {label: '40대', value: Age.Forty},
            {label: '+50대', value: Age.OverFifty},
        ]
    }
]