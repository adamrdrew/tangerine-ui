import { useState, useEffect } from 'react';
import { useApi, configApiRef } from '@backstage/core-plugin-api';

const QueryOpenshift = (userQuery: any) => {
    const [result, setResult] = useState<string>("");
    const [loaded, setLoaded] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    
    const getChatBotResponse = async() => {
        await fetch("http://localhost:5000")
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

    useEffect(() => {
        getChatBotResponse()

    }, [userQuery]);

    return { result, loaded, error }
}
