import React from 'react';
import Icon from 'antd/lib/icon';
import Menu from 'antd/lib/menu';
import { Link } from 'react-router-dom';
import { Crawler } from '../server/typing';

import { getResultsRoute } from '../routes';
import { timestampToString } from '../utils';

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

export const SideMenuResults = (crawlers: Crawler[]) =>
    crawlers.sort(({ timestamp: a }: any, { timestamp: b }: any) => b - a)
        .map(({ timestamp, url, id, diffZoneCount, errorCount, status, inQueue }: any, index: number) => (
            <Menu.Item key={`crawler-${id}`} title={url} style={dividerStyle(index)}>
                <Icon type={getIcon(diffZoneCount, errorCount, status, inQueue)} />
                <span className="nav-text">
                    {timestampToString(timestamp)}
                </span>
                <Link to={getResultsRoute(timestamp)} />
            </Menu.Item>
        ));

