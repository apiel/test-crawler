import React from 'react';
import Spin from 'antd/lib/spin';
import Typography from 'antd/lib/typography';
import { graphql, withApollo } from 'react-apollo';

import GET_CRAWLER from './gql/query/getCrawler';
import { timestampToString } from './utils';
import Pages from './Pages';

const { Title } = Typography;

export const History = ({ data: { getCrawler } }) => getCrawler ? (
    <>
        <Title level={3}>{timestampToString(getCrawler.timestamp)}</Title>
        <p>{getCrawler.url}</p>
        <Pages timestamp={getCrawler.timestamp} />
    </>
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