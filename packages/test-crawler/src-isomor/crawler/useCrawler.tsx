import React from 'react';
import { Crawler } from '../server/typing';
import { getCrawler } from '../server/service';
import { useAsync } from '../hook/useAsync';

export const useCrawler = (
    projectId: string,
    timestamp: string,
) => {
    const { result: crawler, call, error } = useAsync<Crawler>(() => getCrawler(projectId, timestamp));
    return {crawler, call, error };
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