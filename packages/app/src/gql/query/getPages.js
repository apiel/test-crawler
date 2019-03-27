import gql from 'graphql-tag';

import SelectPage from '../fragment/page';

const template = gql`
query getPagesByTimestamp($timestamp: String!)
{
    getPages(timestamp: $timestamp) {
        ...SelectPage
    }
}
${SelectPage}
`;

export default template;