import { useState, useEffect } from 'react';
import { useApi, configApiRef } from '@backstage/core-plugin-api';

export const GetAgents = () => {
    const [result, setResult] = useState<any>([]);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    // Get Backstage objects
    const config = useApi(configApiRef);
    const backendUrl = config.getString('backend.baseUrl');
    
    const getAllAgents = () => {
        const requestOptions = {
            headers: { 'Content-Type': 'application/json' }
        };

        fetch(`${backendUrl}/api/proxy/backend/api/agents`, requestOptions)
        .then(response => response.json())
        .then(response => {
            setLoaded(true)
            setResult(response.data)
        })
        .catch((_error) => {
            setError(true)
            console.error(`Error fetching agents from backend`);
        })
    }

    useEffect(() => {
        getAllAgents()
    }, []);

    console.log(result)

    return { result, loaded, error }
}
