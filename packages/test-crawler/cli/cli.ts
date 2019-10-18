#!/usr/bin/env node

import { checkSync, lockSync } from 'lockfile';
import { info } from 'logol';
import { join } from 'path';
import { CrawlerProvider } from '../dist-server/server/lib';
import { crawl } from '../dist-server/server/lib/crawl';
import * as configs from '../dist-server/server/lib/config';

const lockFile = join(__dirname, '../../test-crawler.lock');

async function start() {
    const [, , option, value] = process.argv;
    let pagesFolder: string | undefined;
    if (option && value) {
        if (option === '--preset') {
            const crawlerProvider = new CrawlerProvider();
            const crawlerInput = await crawlerProvider.startCrawlerWithPresetFile(value);
            info('Start with preset', crawlerInput);
        } else if (option === '--folder') {
            pagesFolder = value;
            info('Start to crawl specific queue', pagesFolder);
        }
    }
    info('Config', configs);
    crawl(pagesFolder);
}

if (!checkSync(lockFile)) {
    lockSync(lockFile);
    start();
} else {
    info('Test-crawler already running', lockFile);
}
