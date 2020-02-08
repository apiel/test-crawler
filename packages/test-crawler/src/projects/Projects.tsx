import React from 'react';
import List from 'antd/lib/list';
import Button from 'antd/lib/button';
import { Link } from 'react-router-dom';
import notification from 'antd/lib/notification';
import Typography from 'antd/lib/typography';
import { loadProjects } from '../server/service';
import { Projects as ProjectsType, Project } from '../server/typing';
import { getNewProjectRoute, getProjectRoute } from '../routes';

const load = async (
    setProjects: React.Dispatch<React.SetStateAction<ProjectsType>>,
) => {
    try {
        const list = await loadProjects();
        setProjects(list);
    } catch (error) {
        notification['warning']({
            message: 'Something went wrong while loading projects.',
            description: error.toString(),
        });
    }
}

export const Projects = () => {
    const [projects, setProjects] = React.useState<ProjectsType>({});

    React.useEffect(() => { load(setProjects); }, []);
    return (
        <>
            <Typography.Title level={3}>Projects</Typography.Title>
            {Object.keys(projects).map(remoteType => (
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
                </>
            ))}
            <br />
            <Link to={getNewProjectRoute()}>
                <Button icon="plus" size="small">New</Button>
            </Link>
        </>
    );
}
