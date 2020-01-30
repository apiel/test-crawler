import React from 'react';
import { PageData } from '../server/typing';
import { getPins } from '../server/service';

const load = async (
    projectId: string,
    setPins: React.Dispatch<React.SetStateAction<PageData[]>>,
    setError: React.Dispatch<React.SetStateAction<string>>,
) => {
    try {
        const pins = await getPins(projectId);
        setPins(pins);
    } catch (error) {
        setError(error);
    }
}
export const usePins = (
    projectId: string,
) => {
    const [pins, setPins] = React.useState<PageData[]>([]);
    const [error, setError] = React.useState();
    React.useEffect(() => { load(projectId, setPins, setError); }, []);
    return { pins, error }
}
