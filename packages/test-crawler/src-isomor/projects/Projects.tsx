import React from 'react';
import List from 'antd/lib/list';
import { Link } from 'react-router-dom';
import notification from 'antd/lib/notification';
import Typography from 'antd/lib/typography';
import { loadPresets } from '../server/service';
import { Preset as PresetType } from '../server/typing';
import { getNewRoute } from '../routes';

const load = async (
    setPresets: React.Dispatch<React.SetStateAction<PresetType[]>>,
) => {
    try {
        const list = await loadPresets();
        setPresets(list);
    } catch (error) {
        notification['warning']({
            message: 'Something went wrong while loading presets.',
            description: error.toString(),
        });
    }
}

export const Projects = () => {
    const [projects, setPresets] = React.useState<PresetType[]>([]);

    React.useEffect(() => { load(setPresets); }, []);
    return (
        <>
            <Typography.Title level={3}>Projects</Typography.Title>
            <List
                itemLayout="horizontal"
                dataSource={projects}
                renderItem={project => (
                    <List.Item
                        actions={[<a key="list-loadmore-edit">edit</a>, <a key="list-loadmore-more">more</a>]}
                    >
                        <List.Item.Meta
                            title={<a href="https://ant.design">{project.name}</a>}
                            description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                        />
                    </List.Item>
                )}
            />
            <Link to={getNewRoute()}>Create a new project</Link>
        </>
    );
}
