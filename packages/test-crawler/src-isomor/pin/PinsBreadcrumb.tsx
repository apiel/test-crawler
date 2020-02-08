import React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import Breadcrumb from 'antd/lib/breadcrumb';
import { getHomeRoute, getProjectRoute, getPinsRoute } from '../routes';
import { useProject } from '../projects/useProject';
import { RemoteType } from '../server/typing';

export const PinsBreadcrumb = ({
    match: { params: { projectId, remoteType } },
}: RouteComponentProps<{ projectId: string, remoteType: RemoteType }>) => {
    const { project } = useProject(remoteType, projectId);
    return (
        <>
            <Breadcrumb.Item><Link to={getHomeRoute()}>Projects</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link to={getProjectRoute(remoteType, projectId)}>{project?.name}</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link to={getPinsRoute(remoteType, projectId)}>Pins</Link></Breadcrumb.Item>
        </>
    );
}
