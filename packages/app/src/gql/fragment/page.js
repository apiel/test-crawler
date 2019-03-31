import gql from 'graphql-tag';

const fragment = gql`
    fragment SelectPage on PageData {
        id
        url
        png {
            width
            diff {
                pixelDiffRatio
                zones {
                    zone {
                        xMin
                        yMin
                        xMax
                        yMax
                    }
                    status
                }
            }
        }
    }
`;

export default fragment;