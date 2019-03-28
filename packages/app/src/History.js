import React from 'react';
import Spin from 'antd/lib/spin';
import { graphql, withApollo } from 'react-apollo';

import GET_CRAWLER from './gql/query/getCrawler';
import Pages from './Pages';
import { CrawlerInfo } from './CrawlerInfo';

export const History = ({ data: { getCrawler } }) => getCrawler ? (
    <>
        <CrawlerInfo crawler={getCrawler} />
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