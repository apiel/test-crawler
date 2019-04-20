import React from 'react';

import Select from 'antd/lib/select';

const { Option } = Select;

export const Viewport = ({ getFieldDecorator, initialValue }: any) => getFieldDecorator(
    'viewport',
    {
        initialValue: initialValue || '{"width":800,"height":600}',
    }
)(
    <Select>
      <Option value='{"width":800,"height":600}'>Desktop - 800x600</Option>
      <Option value='{"width":1024,"height":768}'>Desktop - 1024x768</Option>
      <Option value='{"width":320,"height":568,"isMobile":true,"hasTouch":true}'>iPhone 5 - 320x568</Option>
      <Option value='{"width":375,"height":667,"isMobile":true,"hasTouch":true}'>iPhone 6 - 375x667</Option>
      <Option value='{"width":768,"height":1024,"isMobile":true,"hasTouch":true}'>Ipad - 768x1024</Option>
      <Option value='{"width":360,"height":640,"isMobile":true,"hasTouch":true}'>Galaxy S5 - 360x640</Option>
    </Select>
);
