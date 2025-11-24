import {useState, useEffect} from "react"
import {api} from "@shared/api"

export function useGetApi<T = unknown>(endpoint: string,
                                       optionsString = ""
)  {

    const [data, setData] = useState<T | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)


    useEffect(() => {
        const options = optionsString ? JSON.parse(optionsString) : {}
        api.get<T>(endpoint, options)
            .then((response) => {
                setData(response)
            })
            .catch((error) => setError(error.message))
            .finally(() => setLoading(false))
    }, [endpoint, optionsString])

    return {data, loading, error}
}
