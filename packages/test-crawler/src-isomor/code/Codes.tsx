import React from 'react';
import Spin from 'antd/lib/spin';
import List from 'antd/lib/list';
import Button from 'antd/lib/button';
import Typography from 'antd/lib/typography';
import { CodeInfoList } from '../server/typing';

import { getCodes } from '../server/service';
import { CodeInfo } from './CodeInfo';
import { ErrorHandler } from '../common/ErrorHandler';
import { Link } from 'react-router-dom';
import { getCodeRoute } from '../routes';
import { useAsync } from '../hook/useAsync';

const { Title, Text } = Typography;

interface Props {
    projectId: string;
}
export const Codes = ({ projectId }: Props) => {
    const { error, result } = useAsync<CodeInfoList>(() => getCodes(projectId));
    if (error) {
        return <ErrorHandler description={error.toString()} />;
    }
    return (
        <>
            <Title level={3}>Codes</Title>
            <CodeInfo full={false} />
            {
                result
                    ? <List
                        dataSource={Object.values(result)}
                        renderItem={({ id, name, pattern}) => (
                            <List.Item>
                                <Link to={getCodeRoute(projectId, id)}>{name} <Text code>{pattern}</Text></Link>
                            </List.Item>
                        )}
                    />
                    : <Spin />
            }
            <Link to={getCodeRoute(projectId, Math.floor(Date.now()/1000).toString())}>
                <Button icon="plus" size="small">New</Button>
            </Link>
        </>
    );
}
