const core = require('@actions/core');
const { applyChanges } = require('test-crawler-apply');

async function run() {
    try {
        core.info('Apply changes in test-crawler');
        const changes = core.getInput('changes');
        core.info(`Changes: ${changes}`);
        await applyChanges(JSON.parse(changes));
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();