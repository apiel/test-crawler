import gql from 'graphql-tag';

import SelectCrawler from '../fragment/crawler';

const template = gql`
mutation StartCrawler($input: CrawlerInput!){
    startCrawler(crawler: $input) {
        crawler {
            ...SelectCrawler
        }
        config {
            MAX_HISTORY
        }
    }
}
${SelectCrawler}
`;

export default template;