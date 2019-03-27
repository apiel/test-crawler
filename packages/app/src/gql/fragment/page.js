import gql from 'graphql-tag';

const fragment = gql`
    fragment SelectPage on PageData {
        id
        url
        pixelDiffRatio
    }
`;

export default fragment;