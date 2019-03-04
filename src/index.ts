import { info } from 'npmlog';

import { crawl } from './crawl';
import { parse } from './parse';
import { PAGES_FOLDER } from './config';

async function start() {
    const timestamp = Math.floor(Date.now() / 1000);
    const distFolder = `${PAGES_FOLDER}/${timestamp}`;
    info('Dist folder', distFolder);

    const urls = await crawl(distFolder);
    info('Done', `${urls.length} urls found.`);

    await parse();
}

start();
