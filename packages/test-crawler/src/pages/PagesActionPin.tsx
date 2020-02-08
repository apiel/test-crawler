import React from 'react';
import Icon from 'antd/lib/icon';
import message from 'antd/lib/message';
import notification from 'antd/lib/notification';
import { pin } from '../server/service';
import { StorageType } from '../server/storage.typing';


const onPin = ({ storageType, projectId, timestamp, id }: Props) => async () => {
    try {
        const hide = message.loading('Pin in progress..', 0);
        await pin(storageType, projectId, timestamp.toString(), id);
        hide();
        message.success('Page pinned as reference for comparison.', 2);
    } catch (error) {
        notification['error']({
            message: 'Something went wrong!',
            description: error.toString(),
        });
    }
}

interface Props {
    timestamp: string,
    id: string,
    projectId: string,
    storageType: StorageType,
}

const PagesActionPin = (props: Props) =>
    <Icon
        type="pushpin"
        title="pin as reference for comparison"
        onClick={onPin(props)}
    />;

export default function(props: Props) {
    return PagesActionPin(props);
}
