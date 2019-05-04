import React from 'react';
import Icon from 'antd/lib/icon';
import Menu from 'antd/lib/menu';
import Affix from 'antd/lib/affix';
import { Link } from 'react-router-dom';
import { Crawler } from 'test-crawler-lib';
import { useAsyncCacheEffect } from 'react-async-cache';

import { getHomeRoute, getPinsRoute, getSettingsRoute } from '../routes';
import { getCrawlers } from '../server/crawler';
import { ErrorHandler } from '../common/ErrorHandler';
import { SideMenuResults } from './SideMenuResults';

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
                {crawlers && SideMenuResults(crawlers) }
            </Menu>
            <Affix style={{ position: 'absolute', bottom: 15, left: 15 }}>
                <Link to={getSettingsRoute()}>
                    <Icon type="setting" />
                </Link>
            </Affix>
        </>
    );
}
