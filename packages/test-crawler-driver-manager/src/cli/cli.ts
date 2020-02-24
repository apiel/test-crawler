#!/usr/bin/env node

import { info } from 'logol';

import { getGeckodriver, Platform, getChromedriver } from '../lib';

async function start() {
    info('Test-crawler driver manager');
    // await getGeckodriver(Platform.win);
    await getGeckodriver(Platform.mac);
    // info('Driver file', driverFile);
    // const dstFile = await moveFile('./drivers', driverFile);
    // info('Move file to', dstFile);

    await getChromedriver(Platform.win);
}

start();
