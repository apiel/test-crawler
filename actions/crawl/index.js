const core = require('@actions/core');
const { crawl } = require('test-crawler-cli');
const { generateTinestampFolder } = require('test-crawler-core');
const { execSync } = require('child_process');

async function run() {
    try {
        core.info('Run test-crawler');
        const projectId = core.getInput('projectId');

        execSync(`yarn add geckodriver --peer`, { stdio: 'inherit' });
        const crawlTarget = {
            projectId,
            timestamp: generateTinestampFolder(),
        };
        console.log('crawlTarget', crawlTarget);
        crawl(crawlTarget, 30);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
