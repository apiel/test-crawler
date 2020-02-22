#!/usr/bin/env node

import { checkSync, lockSync } from 'lockfile';
import { info } from 'logol';
import { join } from 'path';
import { CrawlerProvider } from '../dist-server/server/lib';
import { crawl } from '../dist-server/server/lib/crawl';
import * as configs from '../dist-server/server/lib/config';
import { StorageType } from '../dist-server/server/storage.typing';

const lockFile = join(__dirname, '../../test-crawler.lock');

async function start() {
    info('Test-crawler');
    info('Config', configs);
    const [, , option, value] = process.argv;
    if (option && value) {
        if (option === '--project') {
            info('Start project', value);
            const crawlerProvider = new CrawlerProvider(StorageType.Local);
            const result = await crawlerProvider.startCrawler(value);
            info('result', result);
            return;
        }
    }
    crawl(undefined, 30);
}

if (!checkSync(lockFile)) {
    lockSync(lockFile);
    start();
} else {
    info('Test-crawler already running', lockFile);
}
