import React from 'react';
import Alert from 'antd/lib/alert';

interface Props {
    message?: string;
    description: string;
}
export const ErrorHandler = ({ message = 'Something went wrong', description }: Props) => (
    <Alert
        message={message}
        description={description}
        type="warning"
        showIcon
    />
);