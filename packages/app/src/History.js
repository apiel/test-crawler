import React from 'react';

import GET_CRAWLER from './gql/query/getCrawler';
import { graphql, withApollo } from 'react-apollo';

export const History = ({ data: { getCrawler } }) => (
    <>
        History
            {getCrawler && <div>
            <p>{getCrawler.url}</p>
        </div>}
    </>
);

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