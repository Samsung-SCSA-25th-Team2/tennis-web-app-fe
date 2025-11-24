import {Period, Gender, Age, GameType, type Question} from "@shared/types"

export const questions: Question[] = [
    {
        id: 'courtId',
        heading: '테니스장을 선택해 주세요',
        type: 'input',  // TODO: change this
        placeholder: '예시: 서울, 과천, ...'
    },
    {
        id: 'datetime',
        heading: '날짜와 시간을 선택해 주세요',
        type: 'button', // TODO: change this
        options: [
            {label: '1년', value: Period.OneYear},
        ]
    },
    {
        id: 'level',
        heading: '구력을 설정해 주세요',
        type: "button",
        options: [
            {label: '1년', value: Period.OneYear},
            {label: '2년', value: Period.TwoYears},
            {label: '3년', value: Period.ThreeYears},
            {label: '+4년', value: Period.OverFourYears},
        ]
    },
    {
        id: 'gameType',
        heading: '게임 유형을 선택해 주세요',
        type: "button",
        options: [
            {label: '단식', value: GameType.Singles},
            {label: '남복', value: GameType.MenDoubles},
            {label: '여복', value: GameType.WomenDoubles},
            {label: '혼복', value: GameType.MixedDoubles},
        ]
    },
    {
        id: 'playerCount',
        heading: '모집 인원을 작성해 주세요',
        type: "count",
        options: [
            {label: '남자', value: Gender.Male},
            {label: '여자', value: Gender.Female},
        ]
    },
    {
        id: 'age',
        heading: '모집 연령대를 선택해 주세요(복수 선택 가능)',
        type: "button",
        options: [
            {label: '20대', value: Age.Twenty},
            {label: '30대', value: Age.Thirty},
            {label: '40대', value: Age.Forty},
            {label: '+50대', value: Age.OverFifty},
        ]
    },
    {
        id: 'fee',
        heading: '참가비를 입력해주세요',
        type: 'input',
        placeholder: '참가비 입력'
    },
    {
        id: 'description',
        heading: '매칭 소개글을 입력해 주세요',
        type: 'textarea',
        placeholder: '소개글 입력'
    },
]