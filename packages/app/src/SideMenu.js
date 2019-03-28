import React from 'react';
import PropTypes from 'prop-types';
import { graphql, withApollo } from 'react-apollo';
import Icon from 'antd/lib/icon';
import Menu from 'antd/lib/menu';
import { Link } from 'react-router-dom';

import GET_CRAWLERS from './gql/query/getCrawlers';
import { getHomeRoute, getHistoryRoute, getPinsRoute } from './routes';
import { timestampToString } from './utils';

const SideMenu = ({ data: { getCrawlers } }) => {
    return (
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
            {getCrawlers &&
                getCrawlers.sort(({ timestamp: a }, { timestamp: b }) => b - a)
                    .map(({ timestamp, url, id }) => (
                        <Menu.Item key={`crawler-${id}`} title={url}>
                            <Icon type="check" />
                            <span className="nav-text">
                                { timestampToString(timestamp) }
                            </span>
                            <Link to={getHistoryRoute(timestamp)} />
                        </Menu.Item>
                    ))}
        </Menu>
    );
}

SideMenu.propTypes = {
    client: PropTypes.object.isRequired,
};

export default graphql(GET_CRAWLERS)(withApollo(SideMenu));