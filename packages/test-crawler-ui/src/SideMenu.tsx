import React from 'react';
import Icon from 'antd/lib/icon';
import Menu from 'antd/lib/menu';
import Affix from 'antd/lib/affix';
import { Link } from 'react-router-dom';
import { Crawler } from 'test-crawler-lib';
import { useAsyncCacheEffect } from 'react-async-cache';

import { getHomeRoute, getHistoryRoute, getPinsRoute, getSettingsRoute } from './routes';
import { timestampToString } from './utils';
import { getCrawlers } from './server/crawler';
import { ErrorHandler } from './ErrorHandler';

const dividerStyle = (index: number) => index === 0 ? ({
    borderTop: '1px solid #7e8791',
}) : ({});

const getIcon = (diffZoneCount: number, errorCount: number, status: string, inQueue: number) => {
    if (inQueue > 0) {
        return 'loading';
    }
    if (!diffZoneCount && errorCount === 0) {
        return 'check';
    }
    if (status === 'done') {
        return 'issues-close';
    }
    return 'exclamation-circle';
}

export const SideMenu = () => {
    const { response: crawlers, error } = useAsyncCacheEffect<Crawler[]>(getCrawlers);
    if (error) {
        return <ErrorHandler description={error.toString()} />;
    }
    return (
        <>
            <Menu theme="dark" mode="inline">
                <Menu.Item key="new">
                    <Icon type="plus" />
                    <span className="nav-text">New</span>
                    <Link to={getHomeRoute()} />
                </Menu.Item>
                <Menu.Item key="pins">
                    <Icon type="pushpin" />
                    <span className="nav-text">Pins</span>
                    <Link to={getPinsRoute()} />
                </Menu.Item>
                {crawlers &&
                    crawlers.sort(({ timestamp: a }: any, { timestamp: b }: any) => b - a)
                        .map(({ timestamp, url, id, diffZoneCount, errorCount, status, inQueue }: any, index: number) => (
                            <Menu.Item key={`crawler-${id}`} title={url} style={dividerStyle(index)}>
                                <Icon type={getIcon(diffZoneCount, errorCount, status, inQueue)} />
                                <span className="nav-text">
                                    {timestampToString(timestamp)}
                                </span>
                                <Link to={getHistoryRoute(timestamp)} />
                            </Menu.Item>
                        ))}
            </Menu>
            <Affix style={{ position: 'absolute', bottom: 15, left: 15 }}>
                <Link to={getSettingsRoute()}>
                    <Icon type="setting" />
                </Link>
            </Affix>
        </>
    );
}
