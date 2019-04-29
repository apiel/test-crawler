import React from 'react';
import Switch from 'antd/lib/switch';
import message from 'antd/lib/message';
import notification from 'antd/lib/notification';
import { setStatus, getCrawler } from './server/crawler';
import { useAsyncCache } from 'react-async-cache';

const onChange = (update: any, { timestamp }: any) => async (value: boolean) => {
    try {
        const status = value ? 'done' : 'review';
        const crawler = await setStatus(timestamp.toString(), status);
        update(crawler, getCrawler, timestamp.toString());
        message.success(`Status set to "${status}".`, 2);
    } catch (error) {
        notification['error']({
            message: 'Something went wrong!',
            description: error.toString(),
        });
    }
}

export const SwitchStatus = (props: any) => {
    const { update } = useAsyncCache();
    return <Switch
        checkedChildren="done"
        unCheckedChildren="review"
        checked={props.status === 'done'}
        onChange={onChange(update, props)}
    />;
}