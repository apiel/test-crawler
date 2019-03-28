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
                    xMin
                    yMin
                    xMax
                    yMax
                }
            }
        }
    }
`;

export default fragment;