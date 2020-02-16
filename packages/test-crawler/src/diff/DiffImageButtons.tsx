import React from 'react';
import Button from 'antd/lib/button';

import { PageData } from '../server/typing';
import { StorageType } from '../server/storage.typing';
import { useApplyChanges, ChangeItem } from '../hook/useApplyChanges';

const buttonStyle = {
    marginLeft: 5,
    marginRight: 5,
}

interface Props {
    index: number;
    timestamp: string;
    id: string;
    projectId: string;
    storageType: StorageType;
    pages: PageData[];
    setPages: React.Dispatch<React.SetStateAction<PageData[]>>;
}

const onSetStatus = (
    status: string,
    add: (changeItem: ChangeItem) => void,
    { timestamp, id, index, projectId, pages, setPages, storageType }: Props,
) => async () => {
    // try {
    // const pages = await setZoneStatus(storageType, projectId, timestamp, id, index, status);
    add({
        key: ['setZoneStatus', storageType, projectId, timestamp, id, index].join('-'),
        type: 'setZoneStatus',
        args: [storageType, projectId, timestamp, id, index, status],
    });
    const pageIndex = pages.findIndex(({ id: pageId }) => id === pageId);
    if (pages[pageIndex].png?.diff?.zones[index]) {
        pages[pageIndex].png!.diff!.zones[index]!.status = status;
    }
    setPages([...pages]);
    //     message.success('Page pinned as reference for comparison.', 2);
    // } catch (error) {
    //     notification['error']({
    //         message: 'Something went wrong!',
    //         description: error.toString(),
    //     });
    // }
}

export const DiffImageButtons = (props: Props) => {
    const { add } = useApplyChanges();
    return (
        <>
            <Button
                style={buttonStyle}
                icon="check"
                size="small"
                onClick={onSetStatus('valid', add, props)}>Valid</Button>
            <Button
                style={buttonStyle}
                icon="pushpin"
                size="small"
                onClick={onSetStatus('pin', add, props)}>Always valid</Button>
            <Button
                style={buttonStyle}
                icon="warning"
                size="small"
                type="danger"
                onClick={onSetStatus('report', add, props)}>Report</Button>
        </>
    );
}
