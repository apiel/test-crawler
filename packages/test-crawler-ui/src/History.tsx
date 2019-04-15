import React from 'react';
import Spin from 'antd/lib/spin';
import { RouteComponentProps } from 'react-router-dom';
import get from 'lodash/get';

import { Pages}  from './Pages';
import { CrawlerInfo } from './CrawlerInfo';
// import { Crawler } from 'test-crawler-lib';
import { getCrawler } from './server/crawler';
import { useIsomor } from 'isomor-react';

let timer: NodeJS.Timeout;

export const History = ({ match: { params: { timestamp } } }: RouteComponentProps<any>) => {
    const { call, response } = useIsomor(); // <Crawler>
    React.useEffect(() => { call(getCrawler, timestamp); }, []);
    const inQueue = get(response, 'inQueue');
    if (get(response, 'inQueue')) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            call(getCrawler, timestamp);
        }, 1000);
    }
    return response ? (
        <>
            <CrawlerInfo crawler={response} />
            <Pages timestamp={timestamp} inQueue={inQueue} />
        </>
    ) : <Spin />;
}
