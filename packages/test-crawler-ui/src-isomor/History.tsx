import React from 'react';
import Spin from 'antd/lib/spin';
import { RouteComponentProps } from 'react-router-dom';

import { Pages}  from './Pages';
import { CrawlerInfo } from './CrawlerInfo';
import { Crawler } from 'test-crawler-lib';
import { getCrawler } from './server/crawler';

export const History = ({ match: { params: { timestamp } } }: RouteComponentProps<any>) => {
    console.log('timestamp', timestamp);
    const [crawler, setCrawlers] = React.useState<Crawler>();
    const load = async () => {
        setCrawlers(await getCrawler(timestamp));
    }
    React.useEffect(() => { load(); }, []);
    return crawler ? (
        <>
            <CrawlerInfo crawler={crawler} />
            <Pages timestamp={timestamp} />
        </>
    ) : <Spin />;
}
