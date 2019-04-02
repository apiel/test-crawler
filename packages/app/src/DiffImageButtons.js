import React from 'react';
import Button from 'antd/lib/button';
import message from 'antd/lib/message';
import notification from 'antd/lib/notification';
import { graphql } from 'react-apollo';

import SET_ZONE_STATUS from './gql/mutation/setZoneStatus';

const buttonStyle = {
    marginLeft: 5,
    marginRight: 5,
}

const onSetStatus = (status, { mutate, timestamp, id, index }) => async () => {
    try {
        await mutate({
            variables: { timestamp: timestamp.toString(), id, index, status },
        });
        message.success('Page pinned as reference for comparison.', 2);
    } catch (error) {
        notification['error']({
            message: 'Something went wrong!',
            description: error.toString(),
        });
    }
}

const DiffImageButtons = (props) => {
    return (
        <>
            <Button style={buttonStyle} icon="check" size="small" onClick={onSetStatus('valid', props)}>Valid</Button>
            <Button style={buttonStyle} icon="pushpin" size="small" onClick={onSetStatus('pin', props)}>Always valid</Button>
            <Button style={buttonStyle} icon="warning" size="small" type="danger" onClick={onSetStatus('report', props)}>Report</Button>
        </>
    );
}

export default graphql(SET_ZONE_STATUS)(DiffImageButtons);
