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

const { Title } = Typography;

export const Pins = ({ getPins }: any) => (
    <>
        <Title level={3}>Pins</Title>
        {
            getPins ? (
                <Masonry style={masonryStyle} options={masonryOptions}>
                    {getPins.map(({ id, url, png }: any) => (
                        <Card
                            key={id}
                            hoverable
                            style={cardStyle}
                            cover={png && <DiffImage folder='base' id={id} />}
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

export default function (props: any) {
    return Pins(props);
}