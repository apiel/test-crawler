import React from 'react';
import { Link } from 'react-router-dom';
import { getProjectRoute } from '../routes';
import { useProject } from './useProject';
import { StorageType } from '../server/storage.typing';

interface Props {
    projectId: string;
    storageType: StorageType;
}

export const ProjectName = ({
    projectId,
    storageType,
}: Props) => {
    const { project } = useProject(storageType, projectId);
    return !project ? null : (
        <p>
            <b>Project:</b> <Link to={getProjectRoute(storageType, project.id)}>
                {project.name}
            </Link>
        </p>
    );
}
