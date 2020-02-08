import React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import Breadcrumb from 'antd/lib/breadcrumb';
import { getHomeRoute, getProjectRoute, getResultsRoute } from '../routes';
import { useProject } from '../projects/useProject';
import { timestampToString } from '../utils';
import { StorageType } from '../server/storage.typing';

export const CrawlerResultsBreadcrumb = ({
    match: { params: { projectId, timestamp, storageType } },
}: RouteComponentProps<{ projectId: string, timestamp: string, storageType: StorageType }>) => {
    const { project } = useProject(storageType, projectId);
    return (
        <>
            <Breadcrumb.Item><Link to={getHomeRoute()}>Projects</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link to={getProjectRoute(storageType, projectId)}>{project?.name}</Link></Breadcrumb.Item>
            <Breadcrumb.Item>
                <Link to={getResultsRoute(storageType, projectId, timestamp)}>
                    Results: {timestampToString(timestamp)}
                </Link>
            </Breadcrumb.Item>
        </>
    );
}
