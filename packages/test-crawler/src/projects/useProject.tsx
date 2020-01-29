import React from 'react';
import notification from 'antd/lib/notification';
import { Project } from '../server/typing';
import { loadProject } from '../server/service';

const load = async (
    projectId: string,
    setProject: React.Dispatch<React.SetStateAction<Project | undefined>>,
) => {
    try {
        const list = await loadProject(projectId);
        setProject(list);
    } catch (error) {
        notification['warning']({
            message: 'Something went wrong while loading project.',
            description: error.toString(),
        });
    }
}

export const useProject = (projectId: string) => {
    const [project, setProject] = React.useState<Project>();
    React.useEffect(() => { load(projectId, setProject); }, []);

    return { project, setProject };
}
