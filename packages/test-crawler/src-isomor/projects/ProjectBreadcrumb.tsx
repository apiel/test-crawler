import React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { useProject } from './useProject';
import Breadcrumb from 'antd/lib/breadcrumb';
import { getHomeRoute, getProjectRoute } from '../routes';

export const ProjectBreadcrumb = ({
    match: { params: { projectId } },
}: RouteComponentProps<{ projectId: string }>) => {
    const { project } = useProject(projectId);
    return (
        <>
            <Breadcrumb.Item><Link to={getHomeRoute()}>Projects</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link to={getProjectRoute(projectId)}>{project?.name}</Link></Breadcrumb.Item>
        </>
    );
}
