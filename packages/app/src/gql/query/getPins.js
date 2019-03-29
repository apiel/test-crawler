import gql from 'graphql-tag';

import SelectPage from '../fragment/page';

const template = gql`
{
    getPins {
        ...SelectPage
    }
}
${SelectPage}
`;

export default template;