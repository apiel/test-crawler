import React from 'react';
import Icon from 'antd/lib/icon';
import { StorageType } from '../server/storage.typing';
import { useApplyChanges } from '../apply-changes/useApplyChanges';
import { ChangeItem, ChangeType } from '../server/typing';


const onPin = (
    add: (changeItem: ChangeItem) => void,
    { storageType, projectId, timestamp, id }: Props
) => async () => {
    add({
        key: [ChangeType.pin, storageType, projectId, timestamp.toString(), id].join('-'),
        storageType,
        item: {
            type: ChangeType.pin,
            props: { projectId, timestamp, id },
        }
    });
}

interface Props {
    timestamp: string,
    id: string,
    projectId: string,
    storageType: StorageType,
}

const PagesActionPin = (props: Props) => {
    const { add } = useApplyChanges();
    return <Icon
        type="pushpin"
        title="pin as reference for comparison"
        onClick={onPin(add, props)}
    />;
}

export default function (props: Props) {
    return PagesActionPin(props);
}
