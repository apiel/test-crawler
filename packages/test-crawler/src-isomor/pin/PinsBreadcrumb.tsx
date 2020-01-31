import React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import Breadcrumb from 'antd/lib/breadcrumb';
import { getHomeRoute, getProjectRoute, getPinsRoute } from '../routes';
import { useProject } from '../projects/useProject';

export const PinsBreadcrumb = ({
    match: { params: { projectId } },
}: RouteComponentProps<{ projectId: string }>) => {
    const { project } = useProject(projectId);
    return (
        <>
            <Breadcrumb.Item><Link to={getHomeRoute()}>Projects</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link to={getProjectRoute(projectId)}>{project?.name}</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link to={getPinsRoute(projectId)}>Pins</Link></Breadcrumb.Item>
        </>
    );
}
