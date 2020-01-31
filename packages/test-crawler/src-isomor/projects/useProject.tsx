import notification from 'antd/lib/notification';
import { Project } from '../server/typing';
import { loadProject } from '../server/service';
import { useAsync } from '../hook/useAsync';

export const useProject = (projectId: string) => {
    const { result: project, setResult: setProject, error } =
        useAsync<Project>(() => loadProject(projectId));
    if (error) {
        notification['warning']({
            message: 'Something went wrong while loading project.',
            description: error.toString(),
        });
    }
    return { project, setProject };
}
