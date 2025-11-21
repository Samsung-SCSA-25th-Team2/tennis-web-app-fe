import {useState, useEffect} from "react"
import api from "../api/api.ts"

export function useGetApi<T = unknown>(endpoint: string,
                                       options?: {
                                                    useJWT?: boolean;
                                                    useCredentials?: boolean;
                                                    params?: Record<string, string | number | boolean>}
)  {

    const [data, setData] = useState<T | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        api.get<T>(endpoint, options)
            .then((response) => {
                console.log(`Stringify: ${JSON.stringify(response)}`)
                console.log(typeof response)
                setData(response)
            })
            .catch((error) => setError(error.message))
            .finally(() => setLoading(false))
    }, [endpoint, JSON.stringify(options)])
    
    return {data, loading, error}
}
