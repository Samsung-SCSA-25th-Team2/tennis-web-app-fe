import type {Question} from "./types.ts"

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
            {label: '1년', value: 'ONE_YEAR'},
            {label: '2년', value: 'TWO_YEARS'},
            {label: '3년', value: 'THREE_YEARS'},
            {label: '+4년', value: 'OVER_FOUR_YEARS'},
        ]
    },
    {
        id: 'gender',
        heading: '성별이 어떻게 되시나요?',
        type: "button",
        options: [
            {label: '남자', value: 'MALE'},
            {label: '여자', value: 'FEMALE'},
        ]
    },
    {
        id: 'age',
        heading: '나이가 어떻게 되시나요?',
        type: "button",
        options: [
            {label: '20대', value: 'TWENTY'},
            {label: '30대', value: 'THIRTY'},
            {label: '40대', value: 'FORTY'},
            {label: '+50대', value: 'OVER_FIFTY'},
        ]
    }
]