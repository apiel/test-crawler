import gql from 'graphql-tag';

import SelectPage from '../fragment/page';

const template = gql`
mutation Pin($timestamp: String!, $id: String!){
    pin(
        timestamp: $timestamp
        id: $id
    ) {
        ...SelectPage
    }
}
${SelectPage}
`;

export default template;