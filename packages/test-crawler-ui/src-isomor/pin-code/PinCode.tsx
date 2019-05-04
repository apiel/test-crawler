import React from 'react';
import Spin from 'antd/lib/spin';
import Typography from 'antd/lib/typography';
import Card from 'antd/lib/card';
import Icon from 'antd/lib/icon';
import Button from 'antd/lib/button';
import notification from 'antd/lib/notification';
import message from 'antd/lib/message';
import Dropdown from 'antd/lib/dropdown';
import AceEditor from 'react-ace';
import { RouteComponentProps } from 'react-router';

import 'brace/mode/javascript';
import 'brace/theme/tomorrow';

import { iconTheme } from '../pages/pageStyle';
import { DiffImage } from '../diff/DiffImage';
import { PageData } from 'test-crawler-lib';
import { getPin, setPinCode, getPinCode } from '../server/crawler';
import { codeSnippet } from './PinCodeSnippet';
import { PinCodeInfo } from './PinCodeInfo';
import { buttonBarStyle, buttonStyle, aceEditorStyle, cardRightStyle } from './pinCodeStyle';
import { PinCodeCard } from './PinCodeCard';

const { Title } = Typography;

const load = async (
    id: string,
    setPin: React.Dispatch<React.SetStateAction<PageData | undefined>>,
    setCode: React.Dispatch<React.SetStateAction<string>>,
) => {
    try {
        setPin(await getPin(id));
        const code = await getPinCode(id);
        if (code.length) {
            setCode(code);
        }
    } catch (error) {
        notification['error']({
            message: 'Something went wrong!',
            description: error.toString(),
        });
    }
}

const onPlay = () => {
    message.warn('To be implemented.', 2);
}

const onSave = (id: string, code: string) => async () => {
    try {
        await setPinCode(id, code);
        message.success('Code saved.', 2);
    } catch (error) {
        notification['error']({
            message: 'Something went wrong!',
            description: error.toString(),
        });
    }
}

export const PinCode = ({ match: { params: { id } } }: RouteComponentProps<{ id: string }>) => {
    const [code, setCode] = React.useState<string>(`module.exports = async function run(page) {\n// your code\n}`);
    const [pin, setPin] = React.useState<PageData>();

    React.useEffect(() => { load(id, setPin, setCode); }, []);

    return (
        <>
            <Title level={3}>Add some code</Title>
            {
                pin ? (
                    <>
                        <PinCodeInfo />
                        <div style={buttonBarStyle}>
                            <Button icon="save" onClick={onSave(id, code)} style={buttonStyle}>Save</Button>
                            <Button icon="caret-right" onClick={onPlay} style={buttonStyle}>Preview</Button>
                            <Dropdown overlay={codeSnippet(setCode)}>
                                <Button style={buttonStyle}>
                                    Code snippet <Icon type="down" />
                                </Button>
                            </Dropdown>
                        </div>
                        <AceEditor
                            mode="javascript"
                            theme="tomorrow"
                            onChange={setCode}
                            fontSize={14}
                            value={code}
                            style={aceEditorStyle}
                        />
                        <PinCodeCard id={pin.id} png={pin.png} url={pin.url} />
                    </>
                ) : <Spin />
            }
        </>
    );
}
