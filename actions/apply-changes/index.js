const core = require('@actions/core');

async function run() {
    try {
        core.info('Run test-crawler');
        const projectId = core.getInput('projectId');

        const options = {
            env: {
                ...process.env,
                ROOT_FOLDER: process.cwd(),
            }
        };

        if (projectId) {
            core.info(`Run for project ${projectId}`);
            await exec.exec(`npx -p test-crawler test-crawler-cli --project ${projectId}`, [], options);
        } else {
            core.info(`Run for all projects`);
            await exec.exec(`npx -p test-crawler test-crawler-cli`, [], options);
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();