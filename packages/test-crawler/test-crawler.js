#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('Start test crawler');
const DIST_SERVER_FOLDER = `${__dirname}/../test-crawler/dist-server`;
const STATIC_FOLDER = `${__dirname}/../test-crawler/build`;

execSync(`cd ${__dirname} && DIST_SERVER_FOLDER=${DIST_SERVER_FOLDER} STATIC_FOLDER=${STATIC_FOLDER} npm run isomor:server`, {stdio: 'inherit'});
