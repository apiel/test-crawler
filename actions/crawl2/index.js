const core = require('@actions/core');
const { crawl } = require('test-crawler-cli');
const { generateTinestampFolder } = require('test-crawler-core');

async function run() {
    try {
        core.info('Run test-crawler');
        const projectId = core.getInput('projectId');

        await exec.exec(`ls node_modules/geckodriver`);

        core.info(`Install geckodriver`);
        await exec.exec(`yarn add geckodriver`);

        core.info(`Run for project ${projectId}`);
        await exec.exec(`node crawl.js ${projectId}`);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
