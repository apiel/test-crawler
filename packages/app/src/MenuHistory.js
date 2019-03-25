import React from 'react';
import PropTypes from 'prop-types';
import { graphql, withApollo } from 'react-apollo';
import Icon from 'antd/lib/icon';
import Menu from 'antd/lib/menu';
import { Link } from 'react-router-dom';
import { unix } from 'moment';

import GET_CRAWLERS from './gql/query/getCrawlers';

const MenuHistory = ({ data: { getCrawlers } }) => {
    return (
        <Menu theme="dark" mode="inline">
            {getCrawlers && getCrawlers.map(({ timestamp }) => (
                <Menu.Item key={timestamp}>
                    <Icon type="check" />
                    <span className="nav-text">
                        {
                            unix(timestamp)//.format('YYYY.DD.MM HH:mm')
                                           .calendar()
                        }
                    </span>
                    <Link to={ `/history/${timestamp}` } />
                </Menu.Item>
            ))}
        </Menu>
    );
}

MenuHistory.propTypes = {
    client: PropTypes.object.isRequired,
};

export default graphql(GET_CRAWLERS)(withApollo(MenuHistory));