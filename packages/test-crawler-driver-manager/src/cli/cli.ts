#!/usr/bin/env node

import { info, warn } from 'logol';

import {
    Platform,
    Arch,
    Options,
    DriverType,
    driver,
} from '../lib';

interface Item {
    type: DriverType;
    options?: Options;
}

async function start() {
    info('Test-crawler driver manager');

    const [, , jsonItems, destination] = process.argv;

    if (!jsonItems) {
        warn('Missing parameter, please provide json.');
        info(
            `test-crawler-driver-manager '${JSON.stringify([
                { type: 'Chrome', options: { platform: 'darwin' } },
            ])}' optional_destination_folder`,
        );
        info('Driver', DriverType);
        info('Platform', Platform);
        info('Arch', Arch);
        return;
    }

    const items: Item[] = JSON.parse(jsonItems);
    for (const { type, options } of items) {
        await driver(type, options, destination || process.cwd());
    }
}

start();
