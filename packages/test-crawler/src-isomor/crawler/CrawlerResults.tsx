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
import { StorageType } from '../server/storage.typing';

export const CrawlerResults = ({
    match: { params: { timestamp, projectId, storageType } },
}: RouteComponentProps<{ timestamp: string, projectId: string, storageType: StorageType }>) => {
    const { result: crawler, error, setResult: setCrawler } = useAsync<Crawler>(
        () => getCrawler(storageType, projectId, timestamp)
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
                storageType={storageType}
                setCrawler={setCrawler}
            />
            <Pages storageType={storageType} timestamp={timestamp} lastUpdate={lastUpdate!} projectId={projectId} />
        </>
    ) : <Spin />;
}
