import { useState, useEffect } from 'react';
import { useApi, configApiRef } from '@backstage/core-plugin-api';

export const QueryAISearch = (agentId: number, userQuery: any) => {
    const [result, setResult] = useState<string>("");
    const [loaded, setLoaded] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    // Get Backstage objects
    const config = useApi(configApiRef);
    const backendUrl = config.getString('backend.baseUrl'); 

    const getAISearchResponse = async(agentId: number, userQuery: any) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: userQuery }),
            cache: "no-cache"
        };

        if (userQuery !== "") {
            await fetch(`${backendUrl}/api/proxy/backend/api/agents/${agentId}/chat`, requestOptions)
            .then(response => response.json())
            .then(response => {
                setLoaded(true)
                setResult(response)
            })
            .catch((_error) => {
                setError(true)
                console.error(`Error fetching response from backend chat bot server`);
            })
        }
    }

    useEffect(() => {
        getAISearchResponse(agentId, userQuery)
    }, [userQuery]);

    console.log(result)

    return { result, loaded, error }
}
