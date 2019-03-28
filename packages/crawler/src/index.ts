import { crawl } from './crawl';

async function start() {
    await crawl();
}

start();

// create one deamon that run for ever?
// and a queue in pages folder. rename page to data?
// get config file from up folder...