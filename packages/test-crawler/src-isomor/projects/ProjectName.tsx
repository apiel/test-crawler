import React from 'react';
import { Link } from 'react-router-dom';
import { getProjectRoute } from '../routes';
import { useProject } from './useProject';

interface Props {
    projectId: string;
}

export const ProjectName = ({
    projectId
}: Props) => {
    const { project } = useProject(projectId);
    return !project ? null : (
        <p>
            <b>Project:</b> <Link to={getProjectRoute(project.id)}>
                {project.name}
            </Link>
        </p>
    );
}
