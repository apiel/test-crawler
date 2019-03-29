import React from 'react';
import Spin from 'antd/lib/spin';
import Typography from 'antd/lib/typography';
import { graphql, withApollo } from 'react-apollo';
import Card from 'antd/lib/card';
import Icon from 'antd/lib/icon';
import Masonry from 'react-masonry-component';

import GET_PINS from './gql/query/getPins';
import {
    masonryStyle,
    masonryOptions,
    cardStyle,
    coverStyle,
    imgStyle,
    iconTheme,
} from './pageStyle';

const { Title } = Typography;

export const Pins = ({ data: { getPins } }) => (
    <>
        <Title level={3}>Pins</Title>
        {
            getPins ? (
                <Masonry style={masonryStyle} options={masonryOptions}>
                    {getPins.map(({ id, url, png }) => (
                        <Card
                            key={id}
                            hoverable
                            style={cardStyle}
                            cover={png && (
                                <div style={coverStyle}>
                                    <img style={imgStyle} alt="" src={`/crawler/thumbnail/base/${id}`} />
                                </div>
                            )}
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

export default graphql(GET_PINS)(withApollo(Pins));