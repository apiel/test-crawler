import React from 'react';
import List from 'antd/lib/list';
import Button from 'antd/lib/button';
import { Link } from 'react-router-dom';
import Typography from 'antd/lib/typography';
import { Project, RemoteType } from '../server/typing';
import { getProjectRoute } from '../routes';
import { useProjects } from './useProjects';
import Spin from 'antd/lib/spin';

interface Props {
    title: string;
    remoteType: RemoteType;
}

export const ProjectsPerRemote = ({ title, remoteType }: Props) => {
    const { projects } = useProjects(remoteType);
    return (
        <>
            <Typography.Title level={4}>{title}</Typography.Title>
            {!projects ? <Spin /> : <List
                itemLayout="horizontal"
                bordered
                dataSource={projects}
                renderItem={({ id, name, crawlerInput: { url } }) => (
                    <List.Item
                        actions={[
                            <Link to={getProjectRoute(remoteType, id)}>
                                Open
                                    </Link>,
                        ]}
                    >
                        <List.Item.Meta
                            title={<Link to={getProjectRoute(remoteType, id)}>{name}</Link>}
                            description={url}
                        />
                    </List.Item>
                )}
            />}
        </>
    );
}
