import React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import Breadcrumb from 'antd/lib/breadcrumb';
import { getHomeRoute, getProjectRoute, getCodeRoute } from '../routes';
import { useProject } from '../projects/useProject';
import { StorageType } from '../server/typing';

export const CodeBreadcrumb = ({
    match: { params: { projectId, id, storageType } },
}: RouteComponentProps<{ projectId: string, id: string, storageType: StorageType }>) => {
    const { project } = useProject(storageType, projectId);
    return (
        <>
            <Breadcrumb.Item><Link to={getHomeRoute()}>Projects</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link to={getProjectRoute(storageType, projectId)}>{project?.name}</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link to={getCodeRoute(storageType, projectId, id)}>Code</Link></Breadcrumb.Item>
        </>
    );
}
