import notification from 'antd/lib/notification';
import { getCrawlers } from '../server/service';
import { useAsync } from '../hook/useAsync';
import { Crawler } from '../server/typing';
import { StorageType } from '../server/storage.typing';

export const useCrawlers = (storageType: StorageType, projectId: string) => {
    const { result: crawlers, setResult: setCrawlers, error, loading, call: loadCrawlers } = useAsync<Crawler[]>(async () => {
        const list = await getCrawlers(storageType, projectId);
        return list.sort(({ timestamp: a }: any, { timestamp: b }: any) => parseInt(b, 10) - parseInt(a, 10));
    });
    if (error) {
        notification['warning']({
            message: 'Something went wrong while loading crawlers from project.',
            description: error.toString(),
        });
    }
    return {crawlers, setCrawlers, loading, loadCrawlers };
}
