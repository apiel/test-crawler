import gql from 'graphql-tag';

import SelectPage from '../fragment/page';

const template = gql`
mutation SetZoneStatus($timestamp: String!, $id: String!, $index: Float!, $status: String!){
    setZoneStatus(
        timestamp: $timestamp
        id: $id
        index: $index
        status: $status
    ) {
        ...SelectPage
    }
}
${SelectPage}
`;

export default template;