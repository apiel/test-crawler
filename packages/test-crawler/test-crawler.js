#!/usr/bin/env node

const { execSync } = require('child_process');
const { createInterface } = require('readline');
const { existsSync, writeFileSync } = require('fs');
const { join } = require('path');

console.log('Start test crawler');

const testcrawlerJson = join(__dirname, '.test-crawler.json')

if (!existsSync(testcrawlerJson)) {
    setup();
} else {
    startTestCrawler();
}

function startTestCrawler() {
    const DIST_SERVER_FOLDER = `${__dirname}/../test-crawler/dist-server`;
    const STATIC_FOLDER = `${__dirname}/../test-crawler/build`;

    execSync(
        `cd ${__dirname} && ISOMOR_DIST_SERVER_FOLDER=${DIST_SERVER_FOLDER} ISOMOR_STATIC_FOLDER=${STATIC_FOLDER} npm run isomor:server`,
        { stdio: 'inherit' },
    );
}

function setup() {
    const readline = createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    function askPuppeteer() {
        readline.question(
            `
    This is the first time you are running test-crawler.
    Puppeteer is a browser for running test snapshot.
    Do you want to install it? [Y,N] `,
            value => {
                const VALUE = value.toLocaleUpperCase();
                if (['Y', 'N'].includes(VALUE)) {
                    if (VALUE === 'Y') {
                        execSync(
                            `node ${join(__dirname, 'node_modules', 'puppeteer-core', 'install.js')}`,
                            { stdio: 'inherit' },
                        );
                    }
                    readline.close();
                    // create an empty file
                    writeFileSync(testcrawlerJson, '');
                    startTestCrawler();
                } else {
                    console.warn('\nPlease type Y (yes) or N (no).');
                    askPuppeteer();
                }
            },
        );
    }
    askPuppeteer();
}
