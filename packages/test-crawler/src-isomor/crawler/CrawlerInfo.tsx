import React from 'react';
import Typography from 'antd/lib/typography';
import Progress from 'antd/lib/progress';
import Icon from 'antd/lib/icon';
import { Crawler, Browser } from 'test-crawler-core';
import { duration } from 'moment';
import 'moment-duration-format';

import { timestampToString } from '../utils';
import { SwitchStatus } from './SwitchStatus';
import { getViewportName } from '../viewport';
import { ProjectName } from '../projects/ProjectName';
import { StorageType } from '../server/storage.typing';

const { Title } = Typography;

const warningStyle = {
    color: '#faad29',
};

const limitStyle = {
    color: '#999',
    fontSize: 11,
};

interface Props {
    setCrawler: React.Dispatch<React.SetStateAction<Crawler>>;
    crawler: Crawler;
    projectId: string;
    storageType: StorageType;
}

// need to flatten props and use react memo
export const CrawlerInfo = ({
    crawler: {
        timestamp,
        url,
        browser,
        diffZoneCount,
        errorCount,
        status,
        urlsCount,
        inQueue,
        startAt,
        lastUpdate,
        limit,
        viewport,
    },
    projectId,
    storageType,
    setCrawler,
}: Props) => {
    const total = urlsCount + inQueue;
    const percent = Math.floor((urlsCount / total) * 100);
    const screen = getViewportName(viewport);
    return (
        <>
            <Title level={3}>{timestampToString(timestamp)}</Title>
            {(diffZoneCount > 0 || errorCount > 0) && (
                <p>
                    <SwitchStatus
                        storageType={storageType}
                        setCrawler={setCrawler}
                        projectId={projectId}
                        status={status}
                        timestamp={timestamp}
                    />
                </p>
            )}
            <ProjectName projectId={projectId} storageType={storageType} />
            <p>
                <b>URL:</b> {url}
            </p>
            <p>
                <b>Browser:</b> {browser || Browser.ChromePuppeteer}
            </p>
            <p>
                <b>Screen:</b> {screen}
            </p>
            <p>
                <b>URL crawled:</b> {urlsCount}
                {limit !== undefined && limit > 0 && (
                    <span style={limitStyle}> (with limit set to {limit})</span>
                )}
            </p>
            <p>
                <b>Duration:</b>{' '}
                {duration(lastUpdate - startAt).format(
                    'h [hrs], m [min], s [sec]',
                )}
            </p>
            {inQueue > 0 && (
                <>
                    <Progress percent={percent} />
                    <p>
                        <b>In queue:</b> {inQueue}
                    </p>
                </>
            )}
            {errorCount > 0 && (
                <p style={warningStyle}>
                    <Icon type="exclamation-circle" /> {errorCount} error(s)
                    founds
                </p>
            )}
        </>
    );
};
