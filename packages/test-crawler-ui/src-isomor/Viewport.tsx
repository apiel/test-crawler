import React from 'react';

import Select from 'antd/lib/select';
import { viewportsStr, getDefaultViewportStr } from './viewport';

const { Option } = Select;

export const Viewport = ({ getFieldDecorator, initialValue }: any) => getFieldDecorator(
    'viewport',
    {
        initialValue: initialValue || getDefaultViewportStr().name,
    }
)(
    <Select>
        {viewportsStr.map(
            ({ value, name }) => <Option value={value}>{name}</Option>
        )}
    </Select>
);
