const core = require('@actions/core');
const { crawl } = require('test-crawler-cli');
const { generateTinestampFolder } = require('test-crawler-core');

async function run() {
    try {
        const [, , projectId] = process.argv;

        const crawlTarget = {
            projectId,
            timestamp: generateTinestampFolder(),
        };
        crawl(crawlTarget, 30);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
