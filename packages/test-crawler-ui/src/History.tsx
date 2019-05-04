import React from 'react';
import Spin from 'antd/lib/spin';
import { RouteComponentProps } from 'react-router-dom';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';

import { Pages}  from './pages/Pages';
import { CrawlerInfo } from './CrawlerInfo';
import { Crawler } from 'test-crawler-lib';
import { getCrawler, getCrawlers } from './server/crawler';
import { useAsyncCacheEffect, useAsyncCache, Cache, Update } from 'react-async-cache';
import { ErrorHandler } from './ErrorHandler';

const parseRespAndUpdateCache = (
    response: Crawler,
    cache: Cache<Crawler[]>,
    update: Update<Crawler[]>
) => {
    if (response) {
        const crawlers = cache(getCrawlers);
        if (crawlers) {
            const index = crawlers.findIndex(crawler => crawler.id === response.id);
            if (index !== -1) {
                if (!isEqual(crawlers[index], response)) {
                    crawlers[index] = response;
                    update(crawlers, getCrawlers);
                }
            }
        }
    }
}

let timer: NodeJS.Timeout;
const refreshTimeout = (call: () => Promise<string>) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
        call();
    }, 1000);
}

export const History = ({
    match: { params: { timestamp } },
    history,
}: RouteComponentProps<{ timestamp: string }>) => {
    const { cache, update } = useAsyncCache<Crawler[]>();
    const { error, call, response } = useAsyncCacheEffect<Crawler>(getCrawler, timestamp);
    React.useEffect(() => {
        parseRespAndUpdateCache(response, cache, update);
    }, [response]);
    if (error) {
        return <ErrorHandler description={ error.toString() } />;
    }
    const lastUpdate = get(response, 'lastUpdate');
    refreshTimeout(call);
    return response ? (
        <>
            <CrawlerInfo crawler={response} history={history} />
            <Pages timestamp={timestamp} lastUpdate={lastUpdate} />
        </>
    ) : <Spin />;
}
