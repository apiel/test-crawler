import React from 'react';
import Card from 'antd/lib/card';
import Spin from 'antd/lib/spin';
import { graphql, withApollo } from 'react-apollo';
import Masonry from 'react-masonry-component';

import GET_PAGES from './gql/query/getPages';

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

export const Pages = ({ data: { getPages }, timestamp }) => getPages ? (
    <Masonry style={masonryStyle} options={masonryOptions}>
        {getPages.map(({ id, url, pixelDiffRatio }) => (
            <Card
                key={id}
                hoverable
                style={cardStyle}
                cover={(
                    <div style={coverStyle}>
                        <img style={imgStyle} alt="" src={`/crawler/thumbnail/${timestamp}/${id}`} />
                    </div>
                )}
            >
                <p><a href={url}>{url}</a></p>
                <p>Pixel diff ratio: {pixelDiffRatio || 0}</p>
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