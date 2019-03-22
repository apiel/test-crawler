import React from 'react';
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';

const buttonStyle = {
    marginTop: 10,
}

export const New = () => (
    <>
        <Input addonBefore="URL" defaultValue="http://127.0.0.1:3005/" />
        <Button type="primary" icon="caret-right" style={buttonStyle}>Start</Button>
    </>
);
