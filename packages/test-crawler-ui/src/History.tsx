import React from 'react';
import Spin from 'antd/lib/spin';
import { RouteComponentProps } from 'react-router-dom';

import { Pages}  from './Pages';
import { CrawlerInfo } from './CrawlerInfo';
// import { Crawler } from 'test-crawler-lib';
import { getCrawler } from './server/crawler';
import { useIsomor } from 'isomor-react';

export const History = ({ match: { params: { timestamp } } }: RouteComponentProps<any>) => {
    const { call, response } = useIsomor(); // <Crawler>
    React.useEffect(() => { call(getCrawler, timestamp); }, []);
    return response ? (
        <>
            <CrawlerInfo crawler={response} />
            <Pages timestamp={timestamp} />
        </>
    ) : <Spin />;
}
