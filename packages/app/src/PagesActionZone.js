import React from 'react';
import Icon from 'antd/lib/icon';
import message from 'antd/lib/message';
import notification from 'antd/lib/notification';
import { graphql } from 'react-apollo';

import SET_ZONE_STATUS from './gql/mutation/setZoneStatus';

const PagesActionZone = ({ mutate, timestamp, id, zones, status, type }) => {
    const onClick = async () => {
        try {
            for(let index = 0; index < zones.length; index++) {
                await mutate({
                    variables: { timestamp: timestamp.toString(), id, index, status },
                });
            }
            message.success(`All zone are set to "${status}".`, 2);
        } catch (error) {
            notification['error']({
                message: 'Something went wrong!',
                description: error.toString(),
            });
        }
    }
    return (
        <Icon type={type} title={`Set all zone to "${status}".`} onClick={onClick} />
    );
}


export default graphql(SET_ZONE_STATUS)(PagesActionZone);
