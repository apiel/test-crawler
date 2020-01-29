import React from 'react';
import notification from 'antd/lib/notification';
import { Crawler } from '../server/typing';
import { getCrawlers } from '../server/service';

const load = async (
    projectId: string,
    setCrawlers: React.Dispatch<React.SetStateAction<Crawler[]>>,
) => {
    try {
        const list = await getCrawlers(projectId);
        list.sort(({ timestamp: a }: any, { timestamp: b }: any) => b - a);
        setCrawlers(list);
    } catch (error) {
        notification['warning']({
            message: 'Something went wrong while loading crawlers from project.',
            description: error.toString(),
        });
    }
}

export const useCrawlers = (projectId: string) => {
    const [crawlers, setCrawlers] = React.useState<Crawler[]>([]);
    React.useEffect(() => { load(projectId, setCrawlers); }, []);

    return { crawlers, setCrawlers };
}
