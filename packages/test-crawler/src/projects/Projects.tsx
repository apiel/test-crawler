import React from 'react';
import List from 'antd/lib/list';
import Button from 'antd/lib/button';
import { Link } from 'react-router-dom';
import notification from 'antd/lib/notification';
import Typography from 'antd/lib/typography';
import { loadProjects } from '../server/service';
import { Project } from '../server/typing';
import { getNewProjectRoute, getProjectRoute } from '../routes';

const load = async (
    setProjects: React.Dispatch<React.SetStateAction<Project[]>>,
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
    const [projects, setProjects] = React.useState<Project[]>([]);

    React.useEffect(() => { load(setProjects); }, []);
    return (
        <>
            <Typography.Title level={3}>Projects</Typography.Title>
            <List
                itemLayout="horizontal"
                dataSource={projects}
                renderItem={({ id, name, crawlerInput: { url } }) => (
                    <List.Item
                        actions={[
                            <Link to={getProjectRoute(id)}>
                                Open
                            </Link>,
                        ]}
                    >
                        <List.Item.Meta
                            title={<Link to={getProjectRoute(id)}>{name}</Link>}
                            description={url}
                        />
                    </List.Item>
                )}
            />
            <Link to={getNewProjectRoute()}>
                <Button icon="plus" size="small">New</Button>
            </Link>
        </>
    );
}
