import React from 'react';
import Switch from 'antd/lib/switch';
import message from 'antd/lib/message';
import notification from 'antd/lib/notification';
import { setStatus } from '../server/service';
import { Crawler } from '../server/typing';

const onChange = (
    remoteType: string,
    projectId: string,
    timestamp: string,
    setCrawler: React.Dispatch<React.SetStateAction<Crawler>>,
) => async (value: boolean) => {
    try {
        const status = value ? 'done' : 'review';
        const crawler = await setStatus(remoteType, projectId, timestamp, status);
        setCrawler(crawler);
        message.success(`Status set to "${status}".`, 2);
    } catch (error) {
        notification['error']({
            message: 'Something went wrong!',
            description: error.toString(),
        });
    }
}

interface Props {
    remoteType: string;
    projectId: string;
    timestamp: string;
    status: string;
    setCrawler: React.Dispatch<React.SetStateAction<Crawler>>;
}
export const SwitchStatus = ({ remoteType, timestamp, status, projectId, setCrawler }: Props) => {
    return <Switch
        checkedChildren="done"
        unCheckedChildren="review"
        checked={status === 'done'}
        onChange={onChange(remoteType, projectId, timestamp, setCrawler)}
    />;
}