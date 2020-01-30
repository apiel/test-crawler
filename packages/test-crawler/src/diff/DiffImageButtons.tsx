import React from 'react';
import message from 'antd/lib/message';
import notification from 'antd/lib/notification';
import { useAsyncCache, Update } from 'react-async-cache';
import Button from 'antd/lib/button';

import { setZoneStatus } from '../server/service';
import { getPages } from '../server/service';
import { PageData } from '../server/typing';


const buttonStyle = {
    marginLeft: 5,
    marginRight: 5,
}

interface Props {
    index: number;
    timestamp: string;
    id: string;
    projectId: string;
}

const onSetStatus = (
    update: Update<PageData[]>,
    status: string,
    { timestamp, id, index, projectId }: Props,
) => async () => {
    try {
        const pages = await setZoneStatus(projectId, timestamp.toString(), id, index, status);
        update(pages, getPages, projectId, timestamp);
        message.success('Page pinned as reference for comparison.', 2);
    } catch (error) {
        notification['error']({
            message: 'Something went wrong!',
            description: error.toString(),
        });
    }
}

export const DiffImageButtons = (props: Props) => {
    // ToDo fix, dont use async cache? see Pages.tsx
    const { update } = useAsyncCache();
    return (
        <>
            <Button
                style={buttonStyle}
                icon="check"
                size="small"
                onClick={onSetStatus(update, 'valid', props)}>Valid</Button>
            <Button
                style={buttonStyle}
                icon="pushpin"
                size="small"
                onClick={onSetStatus(update, 'pin', props)}>Always valid</Button>
            <Button
                style={buttonStyle}
                icon="warning"
                size="small"
                type="danger"
                onClick={onSetStatus(update, 'report', props)}>Report</Button>
        </>
    );
}
