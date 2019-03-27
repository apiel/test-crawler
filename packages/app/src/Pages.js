import React from 'react';
import Card from 'antd/lib/card';
import Spin from 'antd/lib/spin';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import { graphql, withApollo } from 'react-apollo';
import { withContentRect } from 'react-measure';

import GET_PAGES from './gql/query/getPages';

const cardStyle = {
    // width: 300,
    // margin: 5,
};

const coverStyle = {
    // height: 100,
    // overflow: 'hidden',
    // overflowY: 'scroll',
    textAlign: 'center'
}

const imgStyle = {
    // width: 300,
}

const rowStyle = {
    paddingTop: 10,
    paddingBottom: 10,
}

const colStyle = {
    paddingLeft: 10,
}

export const Pages = ({ data: { getPages }, timestamp, measureRef, measure, contentRect: { bounds: { width } } }) => {
    const colCount = width ? Math.floor(width / 300) : 1;
    const colMap = Array(colCount).fill(1)

    return getPages ? (
        <Row
            style={rowStyle}
        >
            <div ref={measureRef}></div>
            {colMap.map((i, index) => (
                <Col style={index ? colStyle : {}} span={24/colCount} key={`col-${index}`}>
                    {getPages.filter((page, fIndex) => index === fIndex%colCount).map(({ id, url, pixelDiffRatio }) => (
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
                </Col>
            ))}
        </Row>
    ) : <Spin />;
}

export default graphql(GET_PAGES, {
    options: props => {
        const { timestamp } = props;
        return {
            variables: {
                timestamp: timestamp.toString(),
            },
        };
    },
})(withApollo(withContentRect('bounds')(Pages)));