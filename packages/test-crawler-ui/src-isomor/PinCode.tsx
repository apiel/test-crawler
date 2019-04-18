import React from 'react';
import Spin from 'antd/lib/spin';
import Typography from 'antd/lib/typography';
import Card from 'antd/lib/card';
import Icon from 'antd/lib/icon';
import Button from 'antd/lib/button';
import notification from 'antd/lib/notification';
import message from 'antd/lib/message';
import AceEditor from 'react-ace';

import 'brace/mode/javascript';
import 'brace/theme/tomorrow';

import {
    cardStyle,
    iconTheme,
} from './pageStyle';
import { DiffImage } from './DiffImage';
import { PageData } from 'test-crawler-lib';
import { getPin, setPinCode, getPinCode } from './server/crawler';
import { RouteComponentProps } from 'react-router';

const { Title } = Typography;

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

export const PinCode = ({ match: { params: { id } } }: RouteComponentProps<any>) => {
    const [code, setCode] = React.useState<string>();
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

    return (
        <>
            <Title level={3}>Add some code</Title>
            {
                pin ? (
                    <>
                        <div style={buttonBarStyle}>
                            <Button icon="save" onClick={onSave}>Save</Button>
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
