import gql from 'graphql-tag';

import SelectCrawler from '../fragment/crawler';

const template = gql`
mutation SetStatus($timestamp: String!, $status: String!){
    setStatus(
        timestamp: $timestamp
        status: $status
    ) {
        ...SelectCrawler
    }
}
${SelectCrawler}
`;

export default template;