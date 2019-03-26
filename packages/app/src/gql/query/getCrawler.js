import gql from 'graphql-tag';

import SelectCrawler from '../fragment/crawler';

const template = gql`
query getProductById($timestamp: String!)
{
    getCrawler(timestamp: $timestamp) {
        ...SelectCrawler
    }
}
${SelectCrawler}
`;

export default template;