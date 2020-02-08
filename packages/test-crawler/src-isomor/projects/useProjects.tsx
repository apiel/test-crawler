import notification from 'antd/lib/notification';
import { Projects } from '../server/typing';
import { loadProjects } from '../server/service';
import { useAsync } from '../hook/useAsync';

export const useProjects = () => {
    const { result: projects, error, loading } =
        useAsync<Projects>(() => loadProjects());
    if (error) {
        notification['warning']({
            message: 'Something went wrong while loading project.',
            description: error.toString(),
        });
    }
    return { projects, loading };
}
