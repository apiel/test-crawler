import React from 'react';
import Card from 'antd/lib/card';
import Spin from 'antd/lib/spin';
import { graphql, withApollo } from 'react-apollo';

import GET_PAGES from './gql/query/getPages';

export const Pages = ({ data: { getPages } }) => getPages ? (
    <>
        {getPages.map(({ id, url, pixelDiffRatio }) => (
            <Card
                key={id}
                hoverable
                style={{ width: 240 }}
                cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
            >
                <p><a href={url}>{url}</a></p>
                <p>Pixel diff ratio: { pixelDiffRatio || 0}</p>
            </Card>
        ))}
    </>
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