import notification from 'antd/lib/notification';
import { getCrawlers } from '../server/service';
import { useAsync } from '../hook/useAsync';
import { Crawler } from '../server/typing';

export const useCrawlers = (projectId: string) => {
    const { result: crawlers, setResult: setCrawlers, error } = useAsync<Crawler[]>(async () => {
        const list = await getCrawlers(projectId);
        return list.sort(({ timestamp: a }: any, { timestamp: b }: any) => b - a);
    });
    if (error) {
        notification['warning']({
            message: 'Something went wrong while loading crawlers from project.',
            description: error.toString(),
        });
    }
    return {crawlers, setCrawlers };
}
