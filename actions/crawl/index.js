const core = require('@actions/core');
const { crawl } = require('test-crawler-cli');
const { generateTinestampFolder } = require('test-crawler-core');

async function run() {
    try {
        core.info('Run test-crawler');
        const projectId = core.getInput('projectId');

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
