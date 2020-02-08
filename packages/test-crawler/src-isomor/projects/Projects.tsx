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
            {Object.keys(RemoteType).map((key) => (
                <div key={key}>
                    <ProjectsPerRemote
                        title={key}
                        remoteType={RemoteType[key as keyof typeof RemoteType]}
                    />
                    <br />
                </div>
            ))}
            <Link to={getNewProjectRoute()}>
                <Button icon="plus" size="small">New</Button>
            </Link>
        </>
    );
}
