import React from 'react';
import Icon from 'antd/lib/icon';
import Button from 'antd/lib/button';
import notification from 'antd/lib/notification';
import message from 'antd/lib/message';
import Dropdown from 'antd/lib/dropdown';

import { setCode } from '../server/crawler';
import { codeSnippet } from './CodeSnippet';
import { buttonBarStyle, buttonStyle } from './codeStyle';

const onPlay = () => {
    message.warn('To be implemented.', 2);
}

const onSave = (id: string, code: string) => async () => {
    try {
        await setCode(id, code);
        message.success('Code saved.', 2);
    } catch (error) {
        notification['error']({
            message: 'Something went wrong!',
            description: error.toString(),
        });
    }
}

interface Props {
    id: string;
    code: string;
    setCode: React.Dispatch<React.SetStateAction<string>>;
}
export const CodeButtons = ({ setCode, id, code }: Props) => (
    <div style={buttonBarStyle}>
        <Button icon="save" onClick={onSave(id, code)} style={buttonStyle}>Save</Button>
        <Button icon="caret-right" onClick={onPlay} style={buttonStyle}>Preview</Button>
        <Dropdown overlay={codeSnippet(setCode)}>
            <Button style={buttonStyle}>
                Code snippet <Icon type="down" />
            </Button>
        </Dropdown>
    </div>
);
