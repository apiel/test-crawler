import React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import Breadcrumb from 'antd/lib/breadcrumb';
import { getHomeRoute, getProjectRoute, getResultsRoute } from '../routes';
import { useProject } from '../projects/useProject';
import { timestampToString } from '../utils';

export const CrawlerResultsBreadcrumb = ({
    match: { params: { projectId, timestamp, remoteType } },
}: RouteComponentProps<{ projectId: string, timestamp: string, remoteType: string }>) => {
    const { project } = useProject(projectId);
    return (
        <>
            <Breadcrumb.Item><Link to={getHomeRoute()}>Projects</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link to={getProjectRoute(remoteType, projectId)}>{project?.name}</Link></Breadcrumb.Item>
            <Breadcrumb.Item>
                <Link to={getResultsRoute(remoteType, projectId, timestamp)}>
                    Results: {timestampToString(timestamp)}
                </Link>
            </Breadcrumb.Item>
        </>
    );
}
