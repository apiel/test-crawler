import React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import Breadcrumb from 'antd/lib/breadcrumb';
import { getHomeRoute, getProjectRoute, getCodeRoute } from '../routes';
import { useProject } from '../projects/useProject';

export const CodeBreadcrumb = ({
    match: { params: { projectId, id } },
}: RouteComponentProps<{ projectId: string, id: string }>) => {
    const { project } = useProject(projectId);
    return (
        <>
            <Breadcrumb.Item><Link to={getHomeRoute()}>Projects</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link to={getProjectRoute(projectId)}>{project?.name}</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link to={getCodeRoute(projectId, id)}>Code</Link></Breadcrumb.Item>
        </>
    );
}
