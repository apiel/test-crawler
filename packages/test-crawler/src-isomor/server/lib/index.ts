import * as config from './config';

export { CrawlerProvider } from './CrawlerProvider';

export const getConfig = () => config;
export const CrawlerMethod = {
    URLs: 'urls',
    SPIDER_BOT: 'spiderbot',
};
