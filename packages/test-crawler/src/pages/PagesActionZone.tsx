import React from 'react';
import Icon from 'antd/lib/icon';
import message from 'antd/lib/message';
import notification from 'antd/lib/notification';
import { setZonesStatus } from '../server/service';
import { PageData } from '../server/typing';

const onClick = (
    { timestamp, id, status, projectId, setPages, remoteType }: Props,
) => async () => {
    try {
        const pages = await setZonesStatus(remoteType, projectId, timestamp.toString(), id, status);
        setPages(pages);
        message.success(`All zone are set to "${status}".`, 2);
    } catch (error) {
        notification['error']({
            message: 'Something went wrong!',
            description: error.toString(),
        });
    }
}

interface Props {
    remoteType: string;
    setPages: React.Dispatch<React.SetStateAction<PageData[]>>;
    projectId: string;
    timestamp: string;
    id: string;
    status: string;
    type: string;
}
export const PagesActionZone = (props: Props) => {
    const { status, type } = props;
    return (
        <Icon type={type} title={`Set all zone to "${status}".`} onClick={onClick(props)} />
    );
}
