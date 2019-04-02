import React from 'react';
import Switch from 'antd/lib/switch';
import message from 'antd/lib/message';
import notification from 'antd/lib/notification';
import { graphql } from 'react-apollo';

import SET_STATUS from './gql/mutation/setStatus';

const onChange = ({ mutate, timestamp }) => async (value) => {
    try {
        const status = value ? 'done' : 'review';
        await mutate({
            variables: {
                timestamp: timestamp.toString(),
                status,
            },
        });
        message.success(`Status set to "${status}.`, 2);
    } catch (error) {
        notification['error']({
            message: 'Something went wrong!',
            description: error.toString(),
        });
    }
}

const SwitchStatus = (props) =>
    <Switch
        checkedChildren="done"
        unCheckedChildren="review"
        checked={props.status === 'done'}
        onChange={onChange(props)}
    />;

export default graphql(SET_STATUS)(SwitchStatus);
