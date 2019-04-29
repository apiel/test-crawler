import React from 'react';
import Spin from 'antd/lib/spin';
import { RouteComponentProps } from 'react-router-dom';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';

import { Pages}  from './Pages';
import { CrawlerInfo } from './CrawlerInfo';
import { Crawler } from 'test-crawler-lib';
import { getCrawler, getCrawlers } from './server/crawler';
import { useAsyncCacheEffect } from 'react-async-cache';

let timer: NodeJS.Timeout;

export const History = ({ match: { params: { timestamp } }, history }: RouteComponentProps<any>) => {
    const { call, response, cache, update } = useAsyncCacheEffect<Crawler>(getCrawler, timestamp); //
    React.useEffect(() => {
        if (response) {
            const crawlers = cache(getCrawlers) as Crawler[];
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
    }, [response]);
    const lastUpdate = get(response, 'lastUpdate');
    clearTimeout(timer);
    timer = setTimeout(() => {
        call(getCrawler, timestamp);
    }, 1000);
    return response ? (
        <>
            <CrawlerInfo crawler={response} history={history} />
            <Pages timestamp={timestamp} lastUpdate={lastUpdate} />
        </>
    ) : <Spin />;
}
