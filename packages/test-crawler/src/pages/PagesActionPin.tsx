import React from 'react';
import Icon from 'antd/lib/icon';
import message from 'antd/lib/message';
import notification from 'antd/lib/notification';
import { pin } from '../server/service';


const onPin = ({ projectId, timestamp, id }: Props) => async () => {
    try {
        await pin(projectId, timestamp.toString(), id);
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
