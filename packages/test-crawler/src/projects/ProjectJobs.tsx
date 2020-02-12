import React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import Typography from 'antd/lib/typography';
import notification from 'antd/lib/notification';
import { Project as ProjectType, Job } from '../server/typing';
import { saveProject, startCrawler, getJobs } from '../server/service';
import Progress from 'antd/lib/progress';
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
import { Redirect } from './Redirect';
import message from 'antd/lib/message';
import { useAsync } from '../hook/useAsync';

interface Props {
    projectId: string;
    storageType: StorageType;
}

export const ProjectJobs = ({ projectId, storageType }: Props) => {
    const { result: jobs } =
        useAsync<Job[]>(() => getJobs(storageType, projectId));
    return jobs?.length ? (
        <List
            itemLayout="horizontal"
            bordered
            dataSource={jobs}
            style={{ marginBottom: 10 }}
            renderItem={({ status, startAt, stepsCount, stepsDone, currentStep, lastUpdate, url }) => (
                <List.Item
                    actions={[
                        <a href={url} target="_blank" rel="noopener noreferrer">
                            Open
                        </a>,
                    ]}
                >
                    <List.Item.Meta
                        title={<span>CI job {timestampToString(startAt.toString())}</span>}
                        description={<>
                            {!!stepsCount && stepsDone !== undefined && <Progress
                                percent={100 / stepsCount * stepsDone}
                                size="small"
                                format={() => `${stepsDone} of ${stepsCount}`}
                            />}
                            <span><Typography.Text code>{status}</Typography.Text> {currentStep}</span>
                        </>}
                    />
                </List.Item>
            )}
        />
    ) : null;
}
