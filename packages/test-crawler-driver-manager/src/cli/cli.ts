#!/usr/bin/env node

import { info } from 'logol';

import { getGeckodriver, Platform, getChromedriver } from '../lib';

async function start() {
    info('Test-crawler driver manager');
    // const resWin = await getGeckodriver({ platform: Platform.win });
    // const resMac = await getGeckodriver({ platform: Platform.mac });
    // info('res gecko', { resWin, resMac });

    // info('Driver file', driverFile);
    // const dstFile = await moveFile('./drivers', driverFile);
    // info('Move file to', dstFile);

    const resChromeWin = await getChromedriver({ platform: Platform.win });
    info('res chrome', { resChromeWin });
}

start();
