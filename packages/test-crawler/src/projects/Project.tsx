import React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import Typography from 'antd/lib/typography';
import notification from 'antd/lib/notification';
import { Project as ProjectType, StorageType } from '../server/typing';
import { saveProject, startCrawler } from '../server/service';
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

const onStart = (
    history: History<any>,
    projectId: string,
    storageType: StorageType,
) => async () => {
    try {
        const timestamp = await startCrawler(storageType, projectId);
        history.push(getResultsRoute(storageType, projectId, timestamp));
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
    setProject: React.Dispatch<React.SetStateAction<ProjectType>>,
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
    const { project, setProject } = useProject(storageType, projectId);
    const { crawlers, loading } = useCrawlers(storageType, projectId);
    return (
        <>
            <Typography.Title level={3}>Project</Typography.Title>
            {!project ? <Spin /> : <>
                <p><b>Name:</b> {project.name}</p>
                <p><b>ID:</b> {projectId}</p>
                <p><b>URL:</b> {project.crawlerInput.url}</p>
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
                        onClick={onStart(history, projectId, storageType)}
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
