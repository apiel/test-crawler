import React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { useProject } from './useProject';
import Breadcrumb from 'antd/lib/breadcrumb';
import { getHomeRoute, getProjectRoute } from '../routes';
import { RemoteType } from '../server/typing';

export const ProjectBreadcrumb = ({
    match: { params: { projectId, remoteType } },
}: RouteComponentProps<{ projectId: string, remoteType: RemoteType }>) => {
    const { project } = useProject(remoteType, projectId);
    return (
        <>
            <Breadcrumb.Item><Link to={getHomeRoute()}>Projects</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link to={getProjectRoute(remoteType, projectId)}>{project?.name}</Link></Breadcrumb.Item>
        </>
    );
}
