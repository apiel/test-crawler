import gql from 'graphql-tag';

import selectCrawler from '../fragment/crawler';

const template = gql`
{
    getCrawlers {
        ...SelectCrawler
    }
}
${selectCrawler}
`;

export default template;