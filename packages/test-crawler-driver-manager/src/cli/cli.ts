#!/usr/bin/env node

import { info } from 'logol';

import { getGeckodriver, Platform, getChromedriver, Arch, getIedriver } from '../lib';

async function start() {
    info('Test-crawler driver manager');
    const resWin = await getGeckodriver({ platform: Platform.win });
    const resMac = await getGeckodriver({ platform: Platform.mac });
    info('res gecko', { resWin, resMac });

    const resChromeWin = await getChromedriver({ platform: Platform.win });
    info('res chrome', { resChromeWin });

    const resIe = await getIedriver({ platform: Platform.win, arch: Arch.x32 });
    info('res ie', { resIe });
}

start();
