#!/usr/bin/env node

import { info } from 'logol';
import { generateTinestampFolder } from 'test-crawler-core';
import * as configs from 'test-crawler-core/lib/config';

import { crawl } from '../lib';

async function start() {
    info('Test-crawler');
    info('Config', configs);
    const [, , option, value] = process.argv;
    if (option && value) {
        if (option === '--project') {
            const crawlTarget = {
                projectId: value,
                timestamp: generateTinestampFolder(),
            };
            info('Start project', crawlTarget);
            await crawl(crawlTarget);
            return;
        }
    }
    crawl(undefined);
}

start();
