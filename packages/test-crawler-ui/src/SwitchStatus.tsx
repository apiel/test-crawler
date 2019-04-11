import React from 'react';
import Switch from 'antd/lib/switch';
import message from 'antd/lib/message';
import notification from 'antd/lib/notification';

const onChange = ({ mutate, timestamp }: any) => async (value: boolean) => {
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

const SwitchStatus = (props: any) =>
    <Switch
        checkedChildren="done"
        unCheckedChildren="review"
        checked={props.status === 'done'}
        onChange={onChange(props)}
    />;

export default function (props: any) {
    return SwitchStatus(props);
}
