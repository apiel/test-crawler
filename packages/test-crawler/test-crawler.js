#!/usr/bin/env node

const { execSync } = require('child_process');
const { createInterface } = require('readline');

console.log('Start test crawler');

// setup();
startTestCrawler();

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
                    console.log('value', VALUE);
                    readline.close();
                    // startTestCrawler();
                } else {
                    console.warn('\nPlease select Y (yes) or N (no).');
                    askPuppeteer();
                }
            },
        );
    }
    askPuppeteer();
}
