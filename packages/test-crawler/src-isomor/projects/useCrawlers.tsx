import notification from 'antd/lib/notification';
import { getCrawlers } from '../server/service';
import { useAsync } from '../hook/useAsync';
import { Crawler, RemoteType } from '../server/typing';

export const useCrawlers = (remoteType: RemoteType, projectId: string) => {
    const { result: crawlers, setResult: setCrawlers, error, loading } = useAsync<Crawler[]>(async () => {
        const list = await getCrawlers(remoteType, projectId);
        return list.sort(({ timestamp: a }: any, { timestamp: b }: any) => parseInt(b, 10) - parseInt(a, 10));
    });
    if (error) {
        notification['warning']({
            message: 'Something went wrong while loading crawlers from project.',
            description: error.toString(),
        });
    }
    return {crawlers, setCrawlers, loading };
}
