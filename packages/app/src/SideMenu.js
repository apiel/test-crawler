import React from 'react';
import PropTypes from 'prop-types';
import { graphql, withApollo } from 'react-apollo';
import Icon from 'antd/lib/icon';
import Menu from 'antd/lib/menu';
import { Link } from 'react-router-dom';
import { unix } from 'moment';

import GET_CRAWLERS from './gql/query/getCrawlers';
import { getHomeRoute, getHistoryRoute } from './routes';

const SideMenu = ({ data: { getCrawlers } }) => {
    return (
        <Menu theme="dark" mode="inline">
            <Menu.Item key="1">
                <Icon type="plus" />
                <span className="nav-text">New</span>
                <Link to={getHomeRoute()} />
            </Menu.Item>
            {getCrawlers && getCrawlers.map(({ timestamp }) => (
                <Menu.Item key={timestamp}>
                    <Icon type="check" />
                    <span className="nav-text">
                        {
                            unix(timestamp)//.format('YYYY.DD.MM HH:mm')
                                           .calendar()
                        }
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