import React from 'react';
import Card from 'antd/lib/card';
import Spin from 'antd/lib/spin';
import { graphql, withApollo } from 'react-apollo';

import GET_CRAWLER from './gql/query/getCrawler';
import { timestampToString } from './utils';

export const History = ({ data: { getCrawler } }) => getCrawler ? (
    <Card title={timestampToString(getCrawler.timestamp)}>
        <p>{getCrawler.url}</p>
    </Card>
) : <Spin />;

export default graphql(GET_CRAWLER, {
    options: props => {
        const { timestamp } = props.match.params;
        return {
            variables: {
                timestamp,
            },
        };
    },
})(withApollo(History));