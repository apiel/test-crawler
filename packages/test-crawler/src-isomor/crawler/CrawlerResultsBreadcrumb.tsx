import React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import Breadcrumb from 'antd/lib/breadcrumb';
import { getHomeRoute, getProjectRoute, getResultsRoute } from '../routes';
import { useProject } from '../projects/useProject';
import { timestampToString } from '../utils';

export const CrawlerResultsBreadcrumb = ({
    match: { params: { projectId, timestamp } },
}: RouteComponentProps<{ projectId: string, timestamp: string }>) => {
    const { project } = useProject(projectId);
    return (
        <>
            <Breadcrumb.Item><Link to={getHomeRoute()}>Projects</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link to={getProjectRoute(projectId)}>{project?.name}</Link></Breadcrumb.Item>
            <Breadcrumb.Item>
                <Link to={getResultsRoute(projectId, timestamp)}>
                    Results: {timestampToString(parseInt(timestamp, 10))}
                </Link>
            </Breadcrumb.Item>
        </>
    );
}
