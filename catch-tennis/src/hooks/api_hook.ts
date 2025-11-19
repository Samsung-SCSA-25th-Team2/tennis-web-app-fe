import {useState, useEffect} from "react";
import api from "../api/api.ts";

export function useApi<T = unknown>(endpoint: string, options?: { useJWT?: boolean; useCredentials?: boolean })  {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        api.get<T>(endpoint, options)
            .then((response) => {setData(response);})
            .catch((error) => setError(error.message))
            .finally(() => setLoading(false));
    }, [endpoint, options]);
    
    return {data, loading, error};
}
