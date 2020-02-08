import React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import Breadcrumb from 'antd/lib/breadcrumb';
import { getHomeRoute, getProjectRoute, getPinsRoute } from '../routes';
import { useProject } from '../projects/useProject';
import { StorageType } from '../server/storage.typing';

export const PinsBreadcrumb = ({
    match: { params: { projectId, storageType } },
}: RouteComponentProps<{ projectId: string, storageType: StorageType }>) => {
    const { project } = useProject(storageType, projectId);
    return (
        <>
            <Breadcrumb.Item><Link to={getHomeRoute()}>Projects</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link to={getProjectRoute(storageType, projectId)}>{project?.name}</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link to={getPinsRoute(storageType, projectId)}>Pins</Link></Breadcrumb.Item>
        </>
    );
}
