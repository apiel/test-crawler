import React from 'react';
import Spin from 'antd/lib/spin';
import { RouteComponentProps } from 'react-router-dom';
import { subscrib, unsubscrib } from 'isomor';

import { Pages } from '../pages/Pages';
import { CrawlerInfo } from './CrawlerInfo';
import { ErrorHandler } from '../common/ErrorHandler';
import { useAsync } from '../hook/useAsync';
import { Crawler } from '../server/typing';
import { getCrawler } from '../server/service';

export const CrawlerResults = ({
    match: { params: { timestamp, projectId } },
}: RouteComponentProps<{ timestamp: string, projectId: string }>) => {
    const { result: crawler, error, setResult: setCrawler } = useAsync<Crawler>(
        () => getCrawler(projectId, timestamp)
    );
    React.useEffect(() => {
        const id = subscrib(setCrawler);
        return () => unsubscrib(id);
    }, [crawler]);
    if (error) {
        return <ErrorHandler description={error.toString()} />;
    }
    const lastUpdate = crawler?.lastUpdate;
    return crawler ? (
        <>
            <CrawlerInfo crawler={crawler} projectId={projectId} setCrawler={setCrawler} />
            <Pages timestamp={timestamp} lastUpdate={lastUpdate!} projectId={projectId} />
        </>
    ) : <Spin />;
}
