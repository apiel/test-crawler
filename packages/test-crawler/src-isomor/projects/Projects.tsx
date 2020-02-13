import React from 'react';
import Button from 'antd/lib/button';
import { Link } from 'react-router-dom';
import Typography from 'antd/lib/typography';
import { StorageType } from '../server/storage.typing';
import { getNewProjectRoute } from '../routes';
import { ProjectsPerRemote } from './ProjectsPerRemote';
import { useThisDoc } from '../doc/useDoc';
import { Info } from '../common/Info';

export const Projects = () => {
    useThisDoc(Doc);
    return (
        <>
            <Typography.Title level={3}>Projects</Typography.Title>
            {Object.keys(StorageType).map((key) => (
                <div key={key}>
                    <ProjectsPerRemote
                        title={key}
                        storageType={StorageType[key as keyof typeof StorageType]}
                    />
                    <br />
                    <Link to={getNewProjectRoute(StorageType[key as keyof typeof StorageType])}>
                        <Button icon="plus" size="small">New</Button>
                    </Link>
                    <br />
                    <br />
                </div>
            ))}
        </>
    );
}

const Doc = () => (
    <>
        <p>
            Test-crawler is project based. To be able to start a crawler,
            you will first need to create a project by clicking
            on <Button icon="plus" size="small">New</Button>
        </p>
        <p>
            Depending on how test-crawler is hosted, there will be different
            type of storage availble: local, GitHub, and more coming soon...
            If you are running it, yourself, all the storage should be available.
        </p>
        <Typography.Title level={4}>Local</Typography.Title>
        <p>
            The <b>local</b> storage consist to save the data on the server
            where is hosted test-crawler. This is the best option to keep your tests
            private and safe.
        </p>
        <Typography.Title level={4}>GitHub</Typography.Title>
        <p>
            The <b>GitHub</b> storage consist to save the data on a given
            repository. This option is good for public project, especially
            for open source project that are already on GitHub. It will give
            you the possibility to keep history of your tests in relation to
            your code changes. Also this storage is using GitHub CI workflow
            to generate your test, you can therefor integrate it very well
            with your other workflow.
        </p>
        <p>
            To use <b>GitHub</b> storage, we need to provide a user and a <a
                href="https://developer.github.com/v3/auth/#via-oauth-and-personal-access-tokens"
                target="_blank" rel="noopener noreferrer"
            >personal access tokens</a> to the <a
                href="https://developer.github.com/v3/"
                target="_blank" rel="noopener noreferrer"
            >GitHub API</a>. Note, the personal access tokens is a sensible information.
            Use this app, only on a trustable device. To <a
                href="https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line"
                target="_blank" rel="noopener noreferrer"
            >create a token</a>, go in developer settings, personal access tokens and then generate
            new token. In most of the case you will only need to give permission
            for <Typography.Text code>public_repo</Typography.Text>.
        </p>
        <Info>
            <Typography.Paragraph>
                Note: we are not saving any of your credential on a server.
                Everything is save in your cookies. Also
                the <a href="https://apiel.github.io/test-crawler/live/">live version</a> hosted
                on GitHub page is purely static. All the logic is running in your browser.
            </Typography.Paragraph>
        </Info>
        <p>
            Once your credential provided, you will need to select the repository where you want
            to save your tests. In general, it would make sense to save those tests in the same
            repository as the website you are testing. You can switch from one
            repository to the other at anytime.
        </p>
    </>
);
