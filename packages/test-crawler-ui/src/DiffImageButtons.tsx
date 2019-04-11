import React from 'react';
import message from 'antd/lib/message';
import notification from 'antd/lib/notification';

// https://github.com/ant-design/ant-design/issues/15930
import Btn from 'antd/lib/button';
const Button = Btn as any;

const buttonStyle = {
    marginLeft: 5,
    marginRight: 5,
}

// { mutate, timestamp, id, index }
const onSetStatus = (status: string, args: any) => async () => {
    // try {
    //     await mutate({
    //         variables: { timestamp: timestamp.toString(), id, index, status },
    //     });
    //     message.success('Page pinned as reference for comparison.', 2);
    // } catch (error) {
    //     notification['error']({
    //         message: 'Something went wrong!',
    //         description: error.toString(),
    //     });
    // }
}

const DiffImageButtons = (props: any) => {
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

export default function (props: any) {
    return DiffImageButtons(props);
}
