#!/usr/bin/env node

import { info } from 'logol';
import { getGeckodriver, Platform } from '../lib'

async function start() {
    info('Test-crawler driver manager');
    await getGeckodriver(Platform.mac);
}

start();
