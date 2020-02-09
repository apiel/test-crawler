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
    const [, , option, value] = process.argv;
    if (option && value) {
        if (option === '--project') {
            const crawlerProvider = new CrawlerProvider();
            const result = await crawlerProvider.startCrawler(StorageType.Local, value);
            info('Start project', result);
            return;
        }
    }
    info('Config', configs);
    crawl(undefined, 30);
}

if (!checkSync(lockFile)) {
    lockSync(lockFile);
    start();
} else {
    info('Test-crawler already running', lockFile);
}
