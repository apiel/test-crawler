import { info } from 'npmlog';

import { crawl } from './crawl';

async function start() {
    const urls = await crawl();
    info('Done', `${urls.length} urls found.`);
}

start();
