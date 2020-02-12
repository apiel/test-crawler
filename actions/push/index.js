const core = require('@actions/core');
const exec = require('@actions/exec');

async function run() {
    try {
        core.info('Push test-crawler result');

        const token = core.getInput('token');
        const repo = core.getInput('repo');

        const cmd = `
git config --local user.email "action@github.com"
git config --local user.name "Test-crawler"
git add .
git status
git commit -m "[test-crawler] CI save"
git pull
git push "https://${token}@github.com/${repo}"
`;

        const cmds = cmd.split('\n').filter(t => t);
        for (commandLine of cmds) {
            await exec.exec(commandLine);
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
