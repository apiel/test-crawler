import React from 'react';
import Button from 'antd/lib/button';

import { PageData, ChangeStatus, ChangeItem, ChangeType } from '../server/typing';
import { StorageType } from '../server/storage.typing';
import { useApplyChanges } from '../hook/useApplyChanges';

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
    status: ChangeStatus,
    add: (changeItem: ChangeItem) => void,
    { timestamp, id, index, projectId, pages, setPages, storageType }: Props,
) => async () => {
    add({
        key: [ChangeType.setZoneStatus, storageType, projectId, timestamp, id, index].join('-'),
        storageType,
        item: {
            type: ChangeType.setZoneStatus,
            props: { projectId, timestamp, id, index, status },
        }
    });
    const pageIndex = pages.findIndex(({ id: pageId }) => id === pageId);
    if (pages[pageIndex].png?.diff?.zones[index]) {
        pages[pageIndex].png!.diff!.zones[index]!.status = status;
    }
    setPages([...pages]);
}

export const DiffImageButtons = (props: Props) => {
    const { add } = useApplyChanges();
    return (
        <>
            <Button
                style={buttonStyle}
                icon="check"
                size="small"
                onClick={onSetStatus(ChangeStatus.valid, add, props)}>Valid</Button>
            <Button
                style={buttonStyle}
                icon="pushpin"
                size="small"
                onClick={onSetStatus(ChangeStatus.zonePin, add, props)}>Always valid</Button>
            <Button
                style={buttonStyle}
                icon="warning"
                size="small"
                type="danger"
                onClick={onSetStatus(ChangeStatus.report, add, props)}>Report</Button>
        </>
    );
}
