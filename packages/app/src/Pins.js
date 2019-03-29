import React from 'react';
import Spin from 'antd/lib/spin';
import Typography from 'antd/lib/typography';
import { graphql, withApollo } from 'react-apollo';

import GET_PINS from './gql/query/getPins';
import { PinsMap } from './PinsMap';

const { Title } = Typography;

export const Pins = ({ data: { getPins } }) => (
    <>
        <Title level={3}>Pins</Title>
        {
            getPins ? <PinsMap pins={ getPins } /> : <Spin />
        }
    </>
);

export default graphql(GET_PINS)(withApollo(Pins));