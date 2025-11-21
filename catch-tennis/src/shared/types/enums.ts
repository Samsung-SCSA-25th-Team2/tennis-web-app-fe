export const GameType = {
    Singles: 'SINGLES',
    MenDoubles: 'MEN_DOUBLES',
    WomenDoubles: 'WOMEN_DOUBLES',
    MixedDoubles: 'MIXED_DOUBLES'
} as const
export type GameType = (typeof GameType)[keyof typeof GameType];

export const Period = {
    OneYear: 'ONE_YEAR',
    TwoYears: 'TWO_YEARS',
    ThreeYears: 'THREE_YEARS',
    OverFourYears: 'OVER_FOUR_YEARS'
} as const
export type Period = (typeof Period)[keyof typeof Period];

export const Gender = {
    Male: 'MALE',
    Female: 'FEMALE'
} as const
export type Gender = (typeof Gender)[keyof typeof Gender];

export const Age = {
    Twenty: 'TWENTY',
    Thirty: 'THIRTY',
    Forty: 'FORTY',
    OverFifty: 'OVER_FIFTY'
} as const
export type Age = (typeof Age)[keyof typeof Age];