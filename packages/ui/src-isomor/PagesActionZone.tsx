import React from 'react';
import Icon from 'antd/lib/icon';
import message from 'antd/lib/message';
import notification from 'antd/lib/notification';

const onClick = ({ mutate, timestamp, id, zones, status, type }: any) => async () => {
    try {
        for (let index = 0; index < zones.length; index++) {
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

const PagesActionZone = (props: any) => {
    const { status, type } = props;
    return (
        <Icon type={type} title={`Set all zone to "${status}".`} onClick={onClick(props)} />
    );
}

export default function (props: any) {
    return PagesActionZone(props);
}
