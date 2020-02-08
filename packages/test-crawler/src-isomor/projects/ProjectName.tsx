import React from 'react';
import { Link } from 'react-router-dom';
import { getProjectRoute } from '../routes';
import { useProject } from './useProject';
import { RemoteType } from '../server/typing';

interface Props {
    projectId: string;
    remoteType: RemoteType;
}

export const ProjectName = ({
    projectId,
    remoteType,
}: Props) => {
    const { project } = useProject(remoteType, projectId);
    return !project ? null : (
        <p>
            <b>Project:</b> <Link to={getProjectRoute(remoteType, project.id)}>
                {project.name}
            </Link>
        </p>
    );
}
