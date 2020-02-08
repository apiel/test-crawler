import React from 'react';
import List from 'antd/lib/list';
import Button from 'antd/lib/button';
import { Link } from 'react-router-dom';
import notification from 'antd/lib/notification';
import Typography from 'antd/lib/typography';
import { loadProjects } from '../server/service';
import { Projects as ProjectsType, Project } from '../server/typing';
import { getNewProjectRoute, getProjectRoute } from '../routes';
import { useProjects } from './useProjects';
import Spin from 'antd/lib/spin';

export const Projects = () => {
    const { projects } = useProjects();
    return (
        <>
            <Typography.Title level={3}>Projects</Typography.Title>
            {!projects ? <Spin /> : Object.keys(projects).map(remoteType => (
                <>
                    <Typography.Title level={4}>{remoteType}</Typography.Title>
                    <List
                        itemLayout="horizontal"
                        bordered
                        dataSource={projects[remoteType]}
                        renderItem={({ id, name, crawlerInput: { url } }: Project) => (
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
                    />
                    <br />
                </>
            ))}
            <Link to={getNewProjectRoute()}>
                <Button icon="plus" size="small">New</Button>
            </Link>
        </>
    );
}
