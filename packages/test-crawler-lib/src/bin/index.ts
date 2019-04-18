#!/usr/bin/env node

import { checkSync, lockSync } from 'lockfile';
import { info } from 'npmlog';

import { crawl } from './crawl';
import { join } from 'path';

const lockFile = join(__dirname, '../../test-crawler.lock');

if (!checkSync(lockFile)) {
    lockSync(lockFile);
    crawl();
} else {
    info('Test-crawler already running', lockFile);
}
