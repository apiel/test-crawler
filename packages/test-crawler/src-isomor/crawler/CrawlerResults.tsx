import React from 'react';
import Spin from 'antd/lib/spin';
import { RouteComponentProps } from 'react-router-dom';

import { Pages } from '../pages/Pages';
import { CrawlerInfo } from './CrawlerInfo';
import { ErrorHandler } from '../common/ErrorHandler';
import { useCrawler, useCrawlerTimeout } from './useCrawler';

export const CrawlerResults = ({
    match: { params: { timestamp, projectId } },
}: RouteComponentProps<{ timestamp: string, projectId: string }>) => {
    const { error, call, crawler, setCrawler } = useCrawler(projectId, timestamp);
    useCrawlerTimeout(crawler, call);
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
