import React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import Typography from 'antd/lib/typography';
import notification from 'antd/lib/notification';
import { Project as ProjectType, Job, Browser } from '../server/typing';
import { saveProject, startCrawler, getJobs } from '../server/service';
import Spin from 'antd/lib/spin';
import { getViewportName } from '../viewport';
import Icon from 'antd/lib/icon';
import Checkbox, { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { History } from 'history';
import { getResultsRoute, getPinsRoute } from '../routes';
import Button from 'antd/lib/button';
import { useProject } from './useProject';
import { useCrawlers } from './useCrawlers';
import List from 'antd/lib/list';
import { timestampToString } from '../utils';
import { Codes } from '../code/Codes';
import { StorageType } from '../server/storage.typing';
import message from 'antd/lib/message';
import { ProjectJobs } from './ProjectJobs';
import { useAsync } from '../hook/useAsync';
import { useThisDoc } from '../doc/useDoc';

const onStart = (
    history: History<any>,
    projectId: string,
    storageType: StorageType,
    loadJobs: () => Promise<void>,
    browser: Browser,
) => async () => {
    try {
        const hide = message.loading('Starting crawlers', 0);
        const { timestamp, redirect } = await startCrawler(storageType, projectId, browser);
        if (redirect) {
            setTimeout(loadJobs, 5000);
            setTimeout(loadJobs, 10000);
            notification.open({
                duration: 10,
                message: 'Test-crawler started',
                description: 'Test-crawler is running the crawlers on a remote container. To see live progress click open:',
                btn: (<a href={redirect} target="_blank" rel="noopener noreferrer">
                    Open
                </a>),
            });
        } else {
            history.push(getResultsRoute(storageType, projectId, timestamp));
        }
        hide();
    } catch (error) {
        notification['error']({
            message: 'Something went wrong!',
            description: error.toString(),
        });
    }
}

const onAutoPinChange = (
    storageType: StorageType,
    { name, id, crawlerInput }: ProjectType,
    setProject: (response: ProjectType) => Promise<void>,
) => async ({ target: { checked } }: CheckboxChangeEvent) => {
    const project = await saveProject(storageType, { ...crawlerInput, autopin: checked }, name, id);
    setProject(project);
}

const getCrawlerStatusIcon = (diffZoneCount: number, errorCount: number, status: string, inQueue: number) => {
    if (inQueue > 0) {
        return 'loading';
    }
    if (!diffZoneCount && errorCount === 0) {
        return 'check';
    }
    if (status === 'done') {
        return 'issues-close';
    }
    return 'exclamation-circle';
}

export const Project = ({
    match: { params: { projectId, storageType } },
    history,
}: RouteComponentProps<{ projectId: string, storageType: StorageType }>) => {
    useThisDoc(Doc);
    const { project, setProject } = useProject(storageType, projectId);
    const { crawlers, loading, loadCrawlers } = useCrawlers(storageType, projectId);
    const { result: jobs, call: loadJobs } = useAsync<Job[]>(() => getJobs(storageType, projectId));
    const browser = project?.crawlerInput?.browser || Browser.ChromePuppeteer;
    return (
        <>
            <Typography.Title level={3}>Project</Typography.Title>
            {!project ? <Spin /> : <>
                <p><b>Name:</b> {project.name}</p>
                <p><b>ID:</b> {projectId}</p>
                <p><b>URL:</b> {project.crawlerInput.url}</p>
                <p><b>Browser:</b> {browser}</p>
                <p><b>Screen:</b> {getViewportName(project.crawlerInput.viewport)}</p>
                <p><b>Method:</b>
                    {project.crawlerInput.method === 'urls'
                        ? <> <Icon type="ordered-list" /> URLs list</>
                        : <> <Icon type="radar-chart" /> Spider bot
                            {!!project.crawlerInput.limit &&
                                <span style={{ color: '#999', fontSize: 12 }}> (Limit: {project.crawlerInput.limit})</span>}
                        </>
                    }
                </p>
                <p>
                    <Checkbox
                        checked={project.crawlerInput.autopin}
                        onChange={onAutoPinChange(storageType, project, setProject)}
                    >
                        Automatically pin new page founds.
                    </Checkbox>
                </p>
                <p>
                    <Button
                        icon="caret-right"
                        size="small"
                        onClick={onStart(history, projectId, storageType, loadJobs, browser)}
                    >
                        Run
                    </Button> &nbsp;
                    <Link to={getPinsRoute(storageType, projectId)}>
                        <Button
                            icon="pushpin"
                            size="small"
                        >
                            Pins
                        </Button>
                    </Link>
                </p>
                <ProjectJobs jobs={jobs} loadJobs={loadJobs} loadCrawlers={loadCrawlers} />
                <List
                    itemLayout="horizontal"
                    bordered
                    loading={loading}
                    dataSource={crawlers}
                    renderItem={({ timestamp, diffZoneCount, errorCount, status, inQueue }) => (
                        <List.Item
                            actions={[
                                <Link to={getResultsRoute(storageType, projectId, timestamp)}>
                                    Open
                                </Link>,
                            ]}
                        >
                            <List.Item.Meta
                                title={
                                    <Link to={getResultsRoute(storageType, projectId, timestamp)}>
                                        {timestampToString(timestamp)}
                                    </Link>}
                                description={<>
                                    <Icon type={getCrawlerStatusIcon(diffZoneCount, errorCount, status, inQueue)} />
                                    <span> Diff: {diffZoneCount} - Error: {errorCount} - In queue: {inQueue}</span>
                                </>}
                            />
                        </List.Item>
                    )}
                />
            </>}
            <br />
            <Codes projectId={projectId} storageType={storageType} />
        </>
    );
}

const Doc = () => (
    <>
        <p>
            This page give you an overview of a selected project. From there you can see all the
            crawlers that has been started and their results. To run a crawler click
            on <Button icon="caret-right" size="small">Run</Button>
        </p>
        <p>
            After clicking on the run button, you will be either redirected to the result page or
            a job will appear above the list of crawler, this will depends of the crawling storage
            you will use.
        </p>
        <Typography.Title level={4}>Codes</Typography.Title>
        <p>
            Under the list of crawlers, is a codes section. This will let you write your own code
            to interact with the crawler when the job is running. There is different phases where
            you can interact with the crawler: before, during and after crawling.
        </p>
        <p><b>Before all</b></p>
        <p>
            This script will run when the test-crawler is starting, to give you the possibility
            to setup a working environment. This can be useful if you need to start a server to
            run your test against it.
        </p>
        <p><b>For each page</b></p>
        <p>
            This give you the possibility to inject some code in the crawler while parsing the page.
            This code will be executed just after the page finish loaded, before to make the
            screenshot and before extracting the links. This can be really useful to manipulate the
            page before making the screenshot. For example, if you have dynamic element in your
            page, you can simply remove it. You could open some hidden element from an accordion.
            Run some e2e assertion with Jest. There is so much possibility with this feature...
        </p>
        <p><b>After all</b></p>
        <p>
            This script will run when the test-crawler finish. This can be useful to send the
            result to an API or in an email. In the following example, we will show you how
            to send result in slack:
        </p>
        <pre>
            <code>
                {`
// Need to install @slack/web-api where the crawler is running.
// with local storage just do yarn add @slack/web-api
// with remote storage like GitHub you will need to customize the CI job
const { WebClient } = require('@slack/web-api');

const token = 'api_slack_token';
// Given some known conversation ID (representing a public channel, private channel, DM or group DM)
const conversationId = '...';

module.exports = async function run(totalDiffCount, totalErrorCount) {
    const web = new WebClient(token);
    const result = await web.chat.postMessage({
        text: \`Hi, crawler finish his job. We found \${totalDiffCount} diff(s) and \${totalErrorCount} error(s).\`,
        channel: conversationId,
    });
}
            `}
            </code>
        </pre>
        <Typography.Title level={4}>Schedule</Typography.Title>
        <p>
            Right now, test-crawler doesn't offer scheduling out of the box but you can easily setup your own.
            On your server you can use build-in feature, like cronjob on Linux. For that, just
            use <Typography.Text code>test-crawler-cli --project the_id_of_your_project</Typography.Text>.
        </p>
        <p>
            On GitHub, you can reuse the workflow generated by test-crawler
            in <Typography.Text code>.github/workflows</Typography.Text>. Make a copy of the workflow
            under a different name and define the event to trigger the run, see <a
                href="https://help.github.com/en/actions/reference/events-that-trigger-workflows"
                target="_blank" rel="noopener noreferrer"
            >documentation</a>. You need then to specify the project you want to run.
        </p>
        <pre>
            <code>
                {`
name: Test-crawler schedule

on:
  schedule:
    # everyday at 01.00
    - cron:  '* 1 * * *'

jobs:
  test-crawler:
    runs-on: macos-latest

    steps:
    - uses: actions/checkout@v2
    - name: Run test-crawler
      uses: apiel/test-crawler/actions/run@master
      with:
        projectId: put_here_id_of_the_project
    - name: Push changes
      uses: apiel/test-crawler/actions/push@master
      with:
        token: \${{ secrets.GITHUB_TOKEN }}

            `}
            </code>
        </pre>
    </>
);
