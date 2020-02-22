const core = require('@actions/core');
const { crawl } = require('test-crawler-cli');

async function run() {
    try {
        core.info('Run test-crawler');
        const projectId = core.getInput('projectId');

        crawl(projectId, 30);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
