import notification from 'antd/lib/notification';
import { useLocation } from 'react-router-dom';
import { Project } from '../server/typing';
import { loadProject } from '../server/service';
import { useAsync } from '../hook/useAsync';
import { StorageType } from '../server/storage.typing';

export const useProject = (storageType: StorageType, projectId: string) => {
    const location = useLocation();
    console.log('yoyoyoyo', location.state?.project);
    const { result: project, setResult: setProject, error } =
        useAsync<Project>(
            () => loadProject(storageType, projectId),
            [],
            location.state?.project,
            true
        );
    if (error) {
        notification['warning']({
            message: 'Something went wrong while loading project.',
            description: error.toString(),
        });
    }
    return { project, setProject };
}
