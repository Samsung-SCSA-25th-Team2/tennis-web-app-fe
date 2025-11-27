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

const PERIOD_ORDER: Period[] = ['ONE_YEAR', 'TWO_YEARS', 'THREE_YEARS', "OVER_FOUR_YEARS"]
export const getEarliestPeriodLabel = (periods: Period[]) => {
    if (!periods.length) return ''

    const sorted = [...periods].sort((a, b) => {
        return PERIOD_ORDER.indexOf(a) - PERIOD_ORDER.indexOf(b)
    })

    return getPeriodLabel(sorted[0])
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
        case "ALL":
            return "모두"
    }
}

export const GAME_TYPE_OPTIONS: Array<{value: GameType, label: string}> = [
    'SINGLES', 'MEN_DOUBLES', 'WOMEN_DOUBLES', 'MIXED_DOUBLES', 'ALL'
].map(value => (
    {
        value: value as GameType,
        label: getGametypeLabel(value as GameType)
    }
))
