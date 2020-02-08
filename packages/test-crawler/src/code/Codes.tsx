import React from 'react';
import Spin from 'antd/lib/spin';
import List from 'antd/lib/list';
import Button from 'antd/lib/button';
import Typography from 'antd/lib/typography';
import { CodeInfoList, RemoteType } from '../server/typing';

import { getCodes } from '../server/service';
import { CodeInfo } from './CodeInfo';
import { ErrorHandler } from '../common/ErrorHandler';
import { Link } from 'react-router-dom';
import { getCodeRoute } from '../routes';
import { useAsync } from '../hook/useAsync';

const { Title, Text } = Typography;

interface Props {
    remoteType: RemoteType;
    projectId: string;
}
export const Codes = ({ projectId, remoteType }: Props) => {
    const { error, result } = useAsync<CodeInfoList>(() => getCodes(remoteType, projectId));
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
                        bordered
                        dataSource={Object.values(result)}
                        renderItem={({ id, name, pattern }) => (
                            <List.Item
                                actions={[
                                    <Link to={getCodeRoute(remoteType, projectId, id)}>
                                        Edit
                                    </Link>,
                                ]}
                            >
                                <List.Item.Meta
                                    title={
                                        <Link to={getCodeRoute(remoteType, projectId, id)}>
                                            {name} <Text code>{pattern}</Text>
                                        </Link>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                    : <Spin />
            }
            <br />
            <Link to={getCodeRoute(remoteType, projectId, Math.floor(Date.now() / 1000).toString())}>
                <Button icon="plus" size="small">New code</Button>
            </Link>
        </>
    );
}
