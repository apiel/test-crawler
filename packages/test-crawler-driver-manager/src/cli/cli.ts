#!/usr/bin/env node

import { info } from 'logol';

import {
    getGeckodriver,
    Platform,
    getChromedriver,
    Arch,
    getIedriver,
} from '../lib';

async function start() {
    info('Test-crawler driver manager');

    await getGeckodriver({ platform: Platform.win });
    await getGeckodriver({ platform: Platform.mac });
    await getChromedriver({ platform: Platform.win });
    await getIedriver({ platform: Platform.win, arch: Arch.x32 });
}

start();
