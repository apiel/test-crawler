import React from 'react';
import Spin from 'antd/lib/spin';
import Typography from 'antd/lib/typography';
import Card from 'antd/lib/card';
import Icon from 'antd/lib/icon';
import AceEditor from 'react-ace';

import 'brace/mode/javascript';
import 'brace/theme/tomorrow';

import {
    cardStyle,
    iconTheme,
} from './pageStyle';
import { DiffImage } from './DiffImage';
import { PageData } from 'test-crawler-lib';
import { getPin } from './server/crawler';
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

export const PinCode = ({ match: { params: { id } } }: RouteComponentProps<any>) => {
    const [pin, setPin] = React.useState<PageData>();
    const load = async () => {
        setPin(await getPin(id));
    }
    React.useEffect(() => { load(); }, []);

    return (
        <>
            <Title level={3}>Add some code</Title>
            {
                pin ? (
                        <>
                            <AceEditor
                                mode="javascript"
                                theme="tomorrow"
                                // onLoad={this.onLoad}
                                // onChange={this.onChange}
                                fontSize={14}
                                value={``}
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
