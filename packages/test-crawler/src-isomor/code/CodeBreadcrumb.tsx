import React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import Breadcrumb from 'antd/lib/breadcrumb';
import { getHomeRoute, getProjectRoute, getCodeRoute } from '../routes';
import { useProject } from '../projects/useProject';
import { RemoteType } from '../server/typing';

export const CodeBreadcrumb = ({
    match: { params: { projectId, id, remoteType } },
}: RouteComponentProps<{ projectId: string, id: string, remoteType: RemoteType }>) => {
    const { project } = useProject(remoteType, projectId);
    return (
        <>
            <Breadcrumb.Item><Link to={getHomeRoute()}>Projects</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link to={getProjectRoute(remoteType, projectId)}>{project?.name}</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link to={getCodeRoute(remoteType, projectId, id)}>Code</Link></Breadcrumb.Item>
        </>
    );
}
