import React from 'react';
import { Crawler } from '../server/typing';
import { getCrawler } from '../server/service';

const load = (
    projectId: string,
    timestamp: string,
    setCrawler: React.Dispatch<React.SetStateAction<Crawler | undefined>>,
    setError: React.Dispatch<React.SetStateAction<string>>,
) => async () => {
    try {
        const crawler = await getCrawler(projectId, timestamp);
        setCrawler(crawler);
    } catch (error) {
        setError(error);
    }
}
export const useCrawler = (
    projectId: string,
    timestamp: string,
) => {
    const [crawler, setCrawler] = React.useState<Crawler>();
    const [error, setError] = React.useState();
    const call = load(projectId, timestamp, setCrawler, setError);
    React.useEffect(() => { call(); }, []);
    return {crawler, call, error }
}

let timer: NodeJS.Timeout;
export const useCrawlerTimeout = (
    crawler: Crawler | undefined,
    call: () => Promise<void>,
) => {
    React.useEffect(() => {
        clearTimeout(timer);
        if (crawler?.inQueue) {
            timer = setTimeout(() => { call(); }, 1000);
        }
    }, [crawler]);
}