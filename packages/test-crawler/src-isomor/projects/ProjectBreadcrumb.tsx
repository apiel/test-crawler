import React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { useProject } from './useProject';
import Breadcrumb from 'antd/lib/breadcrumb';
import { getHomeRoute, getProjectRoute } from '../routes';
import { StorageType } from '../server/storage.typing';

export const ProjectBreadcrumb = ({
    match: { params: { projectId, storageType } },
}: RouteComponentProps<{ projectId: string, storageType: StorageType }>) => {
    const { project } = useProject(storageType, projectId);
    return (
        <>
            <Breadcrumb.Item><Link to={getHomeRoute()}>Projects</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link to={getProjectRoute(storageType, projectId)}>{project?.name}</Link></Breadcrumb.Item>
        </>
    );
}
