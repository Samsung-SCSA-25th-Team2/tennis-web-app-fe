import type {Gender, Period, Age, GameType} from "@shared/types"


export const getGenderLabel = (gender: Gender) => {
    switch (gender) {
        case "MALE":
            return "남자"
        case "FEMALE":
            return "여자"
        default:
            return "알 수 없음"
    }
}

export const getPeriodLabel = (period: Period) => {
    switch (period) {
        case "ONE_YEAR":
            return "1년"
        case "TWO_YEARS":
            return "2년"
        case "THREE_YEARS":
            return "3년"
        case "OVER_FOUR_YEARS":
            return "4년 이상"
    }
}

export const getAgeLabel = (age: Age) => {
    switch (age) {
        case "TWENTY":
            return "20대"
        case "THIRTY":
            return "30대"
        case "FORTY":
            return "40대"
        case "OVER_FIFTY":
            return "+50대"
    }
}

export const getGametypeLabel= (gametype: GameType) => {
    switch (gametype) {
        case "SINGLES":
            return "단식"
        case "MEN_DOUBLES":
            return "남복"
        case "WOMEN_DOUBLES":
            return "여복"
        case "MIXED_DOUBLES":
            return "혼복"
    }
}

export const GAME_TYPE_OPTIONS: Array<{value: GameType, label: string}> = [
    'SINGLES', 'MEN_DOUBLES', 'WOMEN_DOUBLES', 'MIXED_DOUBLES'
].map(value => (
    {
        value: value as GameType,
        label: getGametypeLabel(value as GameType)
    }
))
