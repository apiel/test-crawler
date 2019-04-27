#!/usr/bin/env node

import { checkSync, lockSync } from 'lockfile';
import { info } from 'npmlog';
import { join } from 'path';
import { CrawlerProvider } from 'test-crawler-lib';

import { crawl } from './crawl';

const lockFile = join(__dirname, '../../test-crawler.lock');

async function start() {
    const [, , presetFile] = process.argv;
    if (presetFile) {
        const crawlerProvider = new CrawlerProvider();
        const crawlerInput = await crawlerProvider.startCrawlerWithPresetFile(presetFile);
        info('Start with preset', JSON.stringify(crawlerInput));
    }
    crawl();
}

if (!checkSync(lockFile)) {
    lockSync(lockFile);
    start();
} else {
    info('Test-crawler already running', lockFile);
}
