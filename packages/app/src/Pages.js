import React from 'react';
import Card from 'antd/lib/card';
import Spin from 'antd/lib/spin';
import Tag from 'antd/lib/tag';
import Icon from 'antd/lib/icon';
import { graphql, withApollo } from 'react-apollo';
import Masonry from 'react-masonry-component';

import GET_PAGES from './gql/query/getPages';
import PagesActionPin from './PagesActionPin';

const cardStyle = {
    width: 320,
    marginBottom: 10,
};

const coverStyle = {
    textAlign: 'center',
    // borderBottom: '1px solid #888',
}

const imgStyle = {
    // width: 300,
}

const masonryStyle = {
    paddingTop: 10,
    paddingBottom: 10,
}

const masonryOptions = {
    gutter: 10,
    // percentPosition: true,
    fitWidth: true,
}

const iconTheme = ''; // twoTone

export const Pages = ({ data: { getPages }, timestamp }) => getPages ? (
    <Masonry style={masonryStyle} options={masonryOptions}>
        {getPages.map(({ id, url, png }) => (
            <Card
                key={id}
                hoverable
                style={cardStyle}
                cover={png && (
                    <div style={coverStyle}>
                        <img style={imgStyle} alt="" src={`/crawler/thumbnail/${timestamp}/${id}`} />
                    </div>
                )}
                actions={[
                    <Icon type="check" />,
                    // <Icon type="pushpin" title="pin as reference for comparison" />,
                    <PagesActionPin timestamp={timestamp} id={id} />,
                    // <Icon type="scissor" title="" />,
                    <Icon type="ellipsis" title="more" />,
                ]}
            >
                <p><Icon type="link" /> <a href={url}>{url}</a></p>
                {!png && <p><Icon type="picture" theme={iconTheme} /> No screenshot available</p>}
                {png && !png.diff && <div><Icon type="picture" theme={iconTheme} /> New screenshot <Tag color="green">New</Tag></div>}
                {png && png.diff && <>
                    <p><Icon type="picture" theme={iconTheme} /> Pixel diff ratio: {png.diff.pixelDiffRatio}</p>
                </>}
            </Card>
        ))}
    </Masonry>
) : <Spin />;

export default graphql(GET_PAGES, {
    options: props => {
        const { timestamp } = props;
        return {
            variables: {
                timestamp: timestamp.toString(),
            },
        };
    },
})(withApollo(Pages));