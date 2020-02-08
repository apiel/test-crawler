import React from 'react';
import Button from 'antd/lib/button';
import { Link } from 'react-router-dom';
import Typography from 'antd/lib/typography';
import { RemoteType } from '../server/typing';
import { getNewProjectRoute } from '../routes';
import { ProjectsPerRemote } from './ProjectsPerRemote';

export const Projects = () => {
    return (
        <>
            <Typography.Title level={3}>Projects</Typography.Title>
            {Object.values(RemoteType).map((remoteType: RemoteType) => (
                <div key={remoteType}>
                    <ProjectsPerRemote remoteType={remoteType} />
                    <br />
                </div>
            ))}
            <Link to={getNewProjectRoute()}>
                <Button icon="plus" size="small">New</Button>
            </Link>
        </>
    );
}
