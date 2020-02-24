#!/usr/bin/env node

import { info, warn } from 'logol';
import * as os from 'os';

import {
    getGeckodriver,
    Platform,
    getChromedriver,
    Arch,
    getIedriver,
    Options,
} from '../lib';

enum Driver {
    Gecko = 'Gecko',
    Chrome = 'Chrome',
    IE = 'IE',
}

interface Item {
    driver: Driver;
    options?: Options;
}

async function start() {
    info('Test-crawler driver manager');

    const [, , jsonItems, destination] = process.argv;

    if (!jsonItems) {
        warn('Missing parameter, please provide json.');
        info(
            `test-crawler-driver-manager '${JSON.stringify([
                { driver: 'Chrome', options: { platform: 'darwin' } },
            ])}' optional_destination_folder`,
        );
        info('Driver', Driver);
        info('Platform', Platform);
        info('Arch', Arch);
        return;
    }

    const items: Item[] = JSON.parse(jsonItems);
    for (const item of items) {
        const option = {
            platform: os.platform(),
            arch: os.arch() as Arch,
            destination,
            ...item.options,
        }
        if (item.driver === Driver.Chrome) {
            await getChromedriver(option);
        } else if (item.driver === Driver.Gecko) {
            await getGeckodriver(option);
        } else if (item.driver === Driver.IE) {
            await getIedriver(option);
        } else {
            warn('Unknown driver', item.driver);
        }
    }
}

start();
