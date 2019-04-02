import React from 'react';
import Icon from 'antd/lib/icon';
import message from 'antd/lib/message';
import notification from 'antd/lib/notification';
import { graphql } from 'react-apollo';

import PIN from './gql/mutation/pin';

const onPin = ({ mutate, timestamp, id }) => async () => {
    try {
        await mutate({
            variables: { timestamp: timestamp.toString(), id },
        });
        message.success('Page pinned as reference for comparison.', 2);
    } catch (error) {
        notification['error']({
            message: 'Something went wrong!',
            description: error.toString(),
        });
    }
}

const PagesActionPin = (props) =>
    <Icon
        type="pushpin"
        title="pin as reference for comparison"
        onClick={onPin(props)}
    />;

export default graphql(PIN)(PagesActionPin);
