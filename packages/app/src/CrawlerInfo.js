import React from 'react';
import Typography from 'antd/lib/typography';
import Switch from 'antd/lib/switch';

import { timestampToString } from './utils';

const { Title } = Typography;

export const CrawlerInfo = ({ crawler: { timestamp, url, diffZoneCount, viewport: { width, height}} }) => (
    <>
        <Title level={3}>{timestampToString(timestamp)}</Title>
        <p><b>URL:</b> {url}</p>
        <p><b>Screen:</b> {width}x{height}</p>
        {diffZoneCount > 0 && <p><Switch checkedChildren="done" unCheckedChildren="review" /></p>}
    </>
);
