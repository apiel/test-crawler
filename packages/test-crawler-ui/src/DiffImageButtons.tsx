import React from 'react';
import message from 'antd/lib/message';
import notification from 'antd/lib/notification';
import { useIsomor } from 'isomor-react';

import { setZoneStatus } from './server/crawler';
import { getPages } from './server/crawler';

// https://github.com/ant-design/ant-design/issues/15930
import Btn from 'antd/lib/button';
const Button = Btn as any;

const buttonStyle = {
    marginLeft: 5,
    marginRight: 5,
}

const onSetStatus = (update: any, status: string, { timestamp, id, index }: any) => async () => {
    try {
        const pages = await setZoneStatus(timestamp.toString(), id, index, status);
        update(pages, getPages, timestamp);
        message.success('Page pinned as reference for comparison.', 2);
    } catch (error) {
        notification['error']({
            message: 'Something went wrong!',
            description: error.toString(),
        });
    }
}

const DiffImageButtons = (props: any) => {
    const { update } = useIsomor();
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

export default function (props: any) {
    return DiffImageButtons(props);
}
