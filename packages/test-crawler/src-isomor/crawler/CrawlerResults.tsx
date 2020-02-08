import React from 'react';
import Spin from 'antd/lib/spin';
import { RouteComponentProps } from 'react-router-dom';
import { subscrib, unsubscrib } from 'isomor';

import { Pages } from '../pages/Pages';
import { CrawlerInfo } from './CrawlerInfo';
import { ErrorHandler } from '../common/ErrorHandler';
import { useAsync } from '../hook/useAsync';
import { Crawler, RemoteType } from '../server/typing';
import { getCrawler } from '../server/service';

export const CrawlerResults = ({
    match: { params: { timestamp, projectId, remoteType } },
}: RouteComponentProps<{ timestamp: string, projectId: string, remoteType: RemoteType }>) => {
    const { result: crawler, error, setResult: setCrawler } = useAsync<Crawler>(
        () => getCrawler(remoteType, projectId, timestamp)
    );
    React.useEffect(() => {
        const id = subscrib(setCrawler);
        return () => unsubscrib(id);
    }, [crawler, setCrawler]);
    if (error) {
        return <ErrorHandler description={error.toString()} />;
    }
    const lastUpdate = crawler?.lastUpdate;
    return crawler ? (
        <>
            <CrawlerInfo
                crawler={crawler}
                projectId={projectId}
                remoteType={remoteType}
                setCrawler={setCrawler}
            />
            <Pages remoteType={remoteType} timestamp={timestamp} lastUpdate={lastUpdate!} projectId={projectId} />
        </>
    ) : <Spin />;
}
