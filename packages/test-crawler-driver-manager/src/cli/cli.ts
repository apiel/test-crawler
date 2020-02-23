#!/usr/bin/env node

import { info } from 'logol';

import { getGeckodriver, Platform, moveFile } from '../lib';

async function start() {
    info('Test-crawler driver manager');
    const driverFile = await getGeckodriver(Platform.win);
    info('Driver file', driverFile);
    const dstFile = await moveFile('./drivers', driverFile);
    info('Move file to', dstFile);
}

start();
