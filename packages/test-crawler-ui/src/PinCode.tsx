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

import {
    cardStyle,
    iconTheme,
} from './pageStyle';
import { DiffImage } from './DiffImage';
import { PageData } from 'test-crawler-lib';
import { getPin, setPinCode, getPinCode } from './server/crawler';
import { Info } from './Info';
import { codeSnippet } from './PinCodeSnippet';

const { Title, Paragraph, Text } = Typography;

const aceEditorStyle = {
    border: '1px solid #EEE',
    marginBottom: 15,
    marginRight: 15,
    float: 'left' as 'left',
}

const cardRightStyle = {
    ...cardStyle,
    float: 'left' as 'left',
}

const buttonBarStyle = {
    marginBottom: 15,
}

const buttonStyle = {
    marginRight: 10,
}

export const PinCode = ({ match: { params: { id } } }: RouteComponentProps<any>) => {
    const [code, setCode] = React.useState<string>(`module.exports = async function run(page) {\n// your code\n}`);
    const [pin, setPin] = React.useState<PageData>();
    const load = async () => {
        setPin(await getPin(id));
        setCode(await getPinCode(id));
    }
    React.useEffect(() => { load(); }, []);

    const onSave = async () => {
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

    const onPlay = () => {
        message.warn('To be implemented.', 2);
    }

    return (
        <>
            <Title level={3}>Add some code</Title>
            {
                pin ? (
                    <>
                        <Info>
                            <Paragraph>
                                Inject some code in the crawler while you are parsing the page. This code will
                                be executed just after the page finish loaded, before to make the screenshot and
                                before extracting the links. You need to export a function that will take as
                                first parameter the <Text code>page</Text> coming from Puppeteer.
                            </Paragraph>
                            <Paragraph>
                                <Text code>module.exports = async (page) => ...some code</Text>
                            </Paragraph>
                        </Info>
                        <div style={buttonBarStyle}>
                            <Button icon="save" onClick={onSave} style={buttonStyle}>Save</Button>
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
                        <Card
                            style={cardRightStyle}
                            cover={pin.png && <DiffImage folder='base' id={pin.id} />}
                        >
                            <p><Icon type="link" /> <a href={pin.url}>{pin.url}</a></p>
                            {!pin.png && <p><Icon type="picture" theme={iconTheme} /> No screenshot available</p>}
                        </Card>
                    </>
                ) : <Spin />
            }
        </>
    );
}
