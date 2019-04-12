import React from 'react';
import Icon from 'antd/lib/icon';
import message from 'antd/lib/message';
import notification from 'antd/lib/notification';
import { useIsomor } from 'isomor-react';
import { setZonesStatus, getPages } from './server/crawler';

const onClick = (update: any, { timestamp, id, zones, status, type }: any) => async () => {
    try {
        const pages = await setZonesStatus(timestamp.toString(), id, status);
        update(pages, getPages, timestamp);
        message.success(`All zone are set to "${status}".`, 2);
    } catch (error) {
        notification['error']({
            message: 'Something went wrong!',
            description: error.toString(),
        });
    }
}

export const PagesActionZone = (props: any) => {
    const { update } = useIsomor();
    const { status, type } = props;
    return (
        <Icon type={type} title={`Set all zone to "${status}".`} onClick={onClick(update, props)} />
    );
}
