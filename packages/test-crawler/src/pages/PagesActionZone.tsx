import React from 'react';
import Icon from 'antd/lib/icon';
import message from 'antd/lib/message';
import notification from 'antd/lib/notification';
import { setZonesStatus } from '../server/service';
import { PageData } from '../server/typing';
import { StorageType } from '../server/storage.typing';

const onClick = (
    { timestamp, id, status, projectId, pages, setPages, storageType }: Props,
) => () => {
    // try {
    // const pages = await setZonesStatus(storageType, projectId, timestamp.toString(), id, status);
    const pageIndex = pages.findIndex(({ id: pageId }) => id === pageId);
    pages[pageIndex].png?.diff?.zones?.forEach(zone => zone.status = status);
    setPages([...pages]); // make a copy else changes don't apply
    //     message.success(`All zone are set to "${status}".`, 2);
    // } catch (error) {
    //     notification['error']({
    //         message: 'Something went wrong!',
    //         description: error.toString(),
    //     });
    // }
}

interface Props {
    storageType: StorageType;
    pages: PageData[];
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
