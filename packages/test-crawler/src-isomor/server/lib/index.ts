import * as config from './config';

export { CrawlerProvider } from './CrawlerProvider';
export { CrawlerLocalProvider } from './CrawlerLocalProvider';
export { CrawlerGitProvider } from './CrawlerGitProvider';

export const getConfig = () => config;
export const CrawlerMethod = {
    URLs: 'urls',
    SPIDER_BOT: 'spiderbot',
};
