#!/usr/bin/env node

import { info } from 'logol';
import { getGeckodriver } from '../lib'

async function start() {
    info('Test-crawler driver manager');
    await getGeckodriver('win32', 'x86');
}

start();
