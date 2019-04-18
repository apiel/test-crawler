import React from 'react';
import Spin from 'antd/lib/spin';
import Typography from 'antd/lib/typography';
import Card from 'antd/lib/card';
import Icon from 'antd/lib/icon';
import Masonry from 'react-masonry-component';

import {
    masonryStyle,
    masonryOptions,
    cardStyle,
    iconTheme,
} from './pageStyle';
import { DiffImage } from './DiffImage';
import { getPins } from './server/crawler';
import { PageData } from 'test-crawler-lib';
import { Link } from 'react-router-dom';
import { getPinCodeRoute } from './routes';

const { Title } = Typography;

export const Pins = () => {
    const [pins, setPins] = React.useState<PageData[]>();
    const load = async () => {
        setPins(await getPins());
    }
    React.useEffect(() => { load(); }, []);


    let masonry: any;
    let timer: NodeJS.Timer;
    const onImg = () => {
        if (masonry) masonry.layout();
        clearTimeout(timer);
        timer = setTimeout(() => {
            if (masonry) masonry.layout();
        }, 500);
    }
    return (
        <>
            <Title level={3}>Pins</Title>
            {
                pins ? (
                    <Masonry
                        style={masonryStyle}
                        options={masonryOptions}
                        ref={(c: any) => { masonry = c && c.masonry; }}
                    >
                        {pins.map(({ id, url, png }: any) => (
                            <Card
                                key={id}
                                style={cardStyle}
                                cover={png && <DiffImage folder='base' id={id} onImg={onImg} />}
                                actions={[
                                    <Icon type="delete" title={`Delete pin`} />,
                                    (<Link to={getPinCodeRoute(id)}>
                                        <Icon type="code" title={`Insert code while crawling`} />
                                    </Link>),
                                ]}
                            >
                                <p><Icon type="link" /> <a href={url}>{url}</a></p>
                                {!png && <p><Icon type="picture" theme={iconTheme} /> No screenshot available</p>}
                            </Card>
                        ))}
                    </Masonry>
                ) : <Spin />
            }
        </>
    );
}
