#!/usr/bin/env node

import { checkSync, lockSync } from 'lockfile';
import { info } from 'logol';
import { join } from 'path';
import { CrawlerProvider } from '../dist-server/server/lib';
import * as configs from '../dist-server/server/lib/config';

import { crawl } from './crawl';

const lockFile = join(__dirname, '../../test-crawler.lock');

async function start() {
    const [, , presetFile] = process.argv;
    if (presetFile) {
        const crawlerProvider = new CrawlerProvider();
        const crawlerInput = await crawlerProvider.startCrawlerWithPresetFile(presetFile);
        info('Start with preset', crawlerInput);
    }
    info('Config', configs);
    crawl();
}

if (!checkSync(lockFile)) {
    lockSync(lockFile);
    start();
} else {
    info('Test-crawler already running', lockFile);
}
