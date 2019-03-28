import gql from 'graphql-tag';

const template = gql`
mutation Pin($timestamp: String!, $id: String!){
    pin(
        timestamp: $timestamp
        id: $id
      ) {
        success
      }
}
`;

export default template;