import React from 'react';
import Switch from 'antd/lib/switch';
import message from 'antd/lib/message';
import notification from 'antd/lib/notification';
import { Crawler } from 'test-crawler-core';

import { setStatus } from '../server/service';
import { StorageType } from '../server/storage.typing';

const onChange = (
    storageType: StorageType,
    projectId: string,
    timestamp: string,
    setCrawler: React.Dispatch<React.SetStateAction<Crawler>>,
) => async (value: boolean) => {
    try {
        const status = value ? 'done' : 'review';
        const crawler = await setStatus(storageType, projectId, timestamp, status);
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
    storageType: StorageType;
    projectId: string;
    timestamp: string;
    status: string;
    setCrawler: React.Dispatch<React.SetStateAction<Crawler>>;
}
export const SwitchStatus = ({ storageType, timestamp, status, projectId, setCrawler }: Props) => {
    return <Switch
        checkedChildren="done"
        unCheckedChildren="review"
        checked={status === 'done'}
        onChange={onChange(storageType, projectId, timestamp, setCrawler)}
    />;
}