import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Typography from 'antd/lib/typography';
import notification from 'antd/lib/notification';
import { Project as ProjectType } from '../server/typing';
import { loadProject } from '../server/service';
import Spin from 'antd/lib/spin';
import { getViewportName } from '../viewport';
import Icon from 'antd/lib/icon';
import Checkbox from 'antd/lib/checkbox';

const load = async (
    id: string,
    setProject: React.Dispatch<React.SetStateAction<ProjectType | undefined>>,
) => {
    try {
        const list = await loadProject(id);
        setProject(list);
    } catch (error) {
        notification['warning']({
            message: 'Something went wrong while loading project.',
            description: error.toString(),
        });
    }
}

export const Project = ({
    match: { params: { id } },
    history,
}: RouteComponentProps<{ id: string }>) => {
    const [project, setProject] = React.useState<ProjectType>();

    React.useEffect(() => { load(id, setProject); }, []);
    return (
        <>
            <Typography.Title level={3}>Project</Typography.Title>
            {!project ? <Spin /> : <>
                <p><b>Name:</b> {project.name}</p>
                <p><b>URL:</b> {project.crawlerInput.url}</p>
                <p><b>Screen:</b> {getViewportName(project.crawlerInput.viewport)}</p>
                <p><b>Method:</b>
                    {project.crawlerInput.method === 'urls'
                        ? <> <Icon type="ordered-list" /> URLs list</>
                        : <> <Icon type="radar-chart" /> Spider bot
                            {!!project.crawlerInput.limit && <span style={{ color: '#999', fontSize: 12 }}> (Limit: {project.crawlerInput.limit})</span>}
                        </>
                    }
                </p>
                <p><Checkbox>Automatically pin new page founds.</Checkbox></p>
            </>}
        </>
    );
}
