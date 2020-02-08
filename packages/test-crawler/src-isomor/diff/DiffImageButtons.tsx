import React from 'react';
import message from 'antd/lib/message';
import notification from 'antd/lib/notification';
import Button from 'antd/lib/button';

import { setZoneStatus } from '../server/service';
import { PageData, RemoteType } from '../server/typing';

const buttonStyle = {
    marginLeft: 5,
    marginRight: 5,
}

interface Props {
    index: number;
    timestamp: string;
    id: string;
    projectId: string;
    remoteType: RemoteType;
    setPages: React.Dispatch<React.SetStateAction<PageData[]>>;
}

const onSetStatus = (
    status: string,
    { timestamp, id, index, projectId, setPages, remoteType }: Props,
) => async () => {
    try {
        const pages = await setZoneStatus(remoteType, projectId, timestamp, id, index, status);
        setPages(pages);
        message.success('Page pinned as reference for comparison.', 2);
    } catch (error) {
        notification['error']({
            message: 'Something went wrong!',
            description: error.toString(),
        });
    }
}

export const DiffImageButtons = (props: Props) => {
    return (
        <>
            <Button
                style={buttonStyle}
                icon="check"
                size="small"
                onClick={onSetStatus('valid', props)}>Valid</Button>
            <Button
                style={buttonStyle}
                icon="pushpin"
                size="small"
                onClick={onSetStatus('pin', props)}>Always valid</Button>
            <Button
                style={buttonStyle}
                icon="warning"
                size="small"
                type="danger"
                onClick={onSetStatus('report', props)}>Report</Button>
        </>
    );
}
