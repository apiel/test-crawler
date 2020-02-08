import React from 'react';
import { Link } from 'react-router-dom';
import { getProjectRoute } from '../routes';
import { useProject } from './useProject';

interface Props {
    projectId: string;
    remoteType: string;
}

export const ProjectName = ({
    projectId,
    remoteType,
}: Props) => {
    const { project } = useProject(projectId);
    return !project ? null : (
        <p>
            <b>Project:</b> <Link to={getProjectRoute(remoteType, project.id)}>
                {project.name}
            </Link>
        </p>
    );
}
