import {format} from "date-fns"


export function toISOStringKR(date: Date) {
    return format(date, "yyyy-MM-dd'T'HH:mm:ss.SSS")
}