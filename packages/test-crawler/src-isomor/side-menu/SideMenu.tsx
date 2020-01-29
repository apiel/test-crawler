import React from 'react';
import Icon from 'antd/lib/icon';
import Menu from 'antd/lib/menu';
import Affix from 'antd/lib/affix';
import { Link } from 'react-router-dom';

import { getHomeRoute, getPinsRoute, getSettingsRoute, getCodesRoute } from '../routes';

export const SideMenu = () => (
        <>
            <Menu theme="dark" mode="inline">
                <Menu.Item key="new">
                    <Icon type="plus" />
                    <span className="nav-text">Projects</span>
                    <Link to={getHomeRoute()} />
                </Menu.Item>
                <Menu.Item key="pins">
                    <Icon type="pushpin" />
                    <span className="nav-text">Pins</span>
                    <Link to={getPinsRoute()} />
                </Menu.Item>
                <Menu.Item key="codes">
                    <Icon type="code" />
                    <span className="nav-text">Codes</span>
                    <Link to={getCodesRoute()} />
                </Menu.Item>
            </Menu>
            <Affix style={{ position: 'absolute', bottom: 15, left: 15 }}>
                <Link to={getSettingsRoute()}>
                    <Icon type="setting" />
                </Link>
            </Affix>
        </>
    );
