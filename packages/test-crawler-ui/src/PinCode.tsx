import React from 'react';
import Spin from 'antd/lib/spin';
import Typography from 'antd/lib/typography';
import Card from 'antd/lib/card';
import Icon from 'antd/lib/icon';

import {
    cardStyle,
    iconTheme,
} from './pageStyle';
import { DiffImage } from './DiffImage';
import { PageData } from 'test-crawler-lib';
import { getPin } from './server/crawler';
import { RouteComponentProps } from 'react-router';

const { Title } = Typography;

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
                            <Card
                                style={cardStyle}
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
