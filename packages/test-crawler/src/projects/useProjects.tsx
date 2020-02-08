import notification from 'antd/lib/notification';
import { Project, RemoteType } from '../server/typing';
import { loadProjects } from '../server/service';
import { useAsync } from '../hook/useAsync';

export const useProjects = (remoteType: RemoteType) => {
    const { result: projects, error, loading } =
        useAsync<Project[]>(() => loadProjects(remoteType));
    if (error) {
        notification['warning']({
            message: `Something went wrong while loading project from ${remoteType}.`,
            description: error.toString(),
        });
    }
    return { projects, loading };
}
