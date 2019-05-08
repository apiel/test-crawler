import React from 'react';
import Spin from 'antd/lib/spin';
import List from 'antd/lib/list';
import Button from 'antd/lib/button';
import Typography from 'antd/lib/typography';
import { CodeInfoList } from 'test-crawler-lib';
import { useAsyncCacheEffect } from 'react-async-cache';

import { getCodes } from '../server/service';
import { CodeInfo } from './CodeInfo';
import { ErrorHandler } from '../common/ErrorHandler';
import { Link } from 'react-router-dom';
import { getCodeRoute } from '../routes';

const { Title, Text } = Typography;

export const Codes = () => {
    const { error, response } = useAsyncCacheEffect<CodeInfoList>(getCodes);
    if (error) {
        return <ErrorHandler description={error.toString()} />;
    }
    return (
        <>
            <Title level={3}>Codes</Title>
            <CodeInfo full={false} />
            {
                response
                    ? <List
                        dataSource={Object.values(response)}
                        renderItem={({ id, name, pattern}) => (
                            <List.Item>
                                <Link to={getCodeRoute(id)}>{name} <Text code>{pattern}</Text></Link>
                            </List.Item>
                        )}
                    />
                    : <Spin />
            }
            <Link to={getCodeRoute(Math.floor(Date.now()/1000).toString())}>
                <Button icon="plus" size="small">New</Button>
            </Link>
        </>
    );
}
