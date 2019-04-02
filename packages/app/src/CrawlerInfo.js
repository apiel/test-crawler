import React from 'react';
import Typography from 'antd/lib/typography';

import { timestampToString } from './utils';
import SwitchStatus from './SwitchStatus';

const { Title } = Typography;

export const CrawlerInfo = ({ crawler: {
    timestamp, url, diffZoneCount, status, urlsCount, inQueue, viewport: { width, height } }
}) => (
        <>
            <Title level={3}>{timestampToString(timestamp)}</Title>
            <p><b>URL:</b> {url}</p>
            <p><b>Screen:</b> {width}x{height}</p>
            <p><b>URL crawled:</b> {urlsCount}</p>
            {inQueue > 0 && <p><b>In queue:</b> {inQueue}</p>}
            {diffZoneCount > 0 && <p><SwitchStatus status={status} timestamp={timestamp} /></p>}
        </>
    );
