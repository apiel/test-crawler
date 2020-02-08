import notification from 'antd/lib/notification';
import { Project, StorageType } from '../server/typing';
import { loadProjects } from '../server/service';
import { useAsync } from '../hook/useAsync';

export const useProjects = (storageType: StorageType) => {
    const { result: projects, error, loading } =
        useAsync<Project[]>(() => loadProjects(storageType));
    if (error) {
        notification['warning']({
            message: `Something went wrong while loading project from ${storageType}.`,
            description: error.toString(),
        });
    }
    return { projects, loading };
}
