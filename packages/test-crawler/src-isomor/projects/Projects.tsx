import React from 'react';
import Button from 'antd/lib/button';
import { Link } from 'react-router-dom';
import Typography from 'antd/lib/typography';
import { StorageType } from '../server/storage.typing';
import { getNewProjectRoute } from '../routes';
import { ProjectsPerRemote } from './ProjectsPerRemote';

export const Projects = () => {
    return (
        <>
            <Typography.Title level={3}>Projects</Typography.Title>
            {Object.keys(StorageType).map((key) => (
                <div key={key}>
                    <ProjectsPerRemote
                        title={key}
                        storageType={StorageType[key as keyof typeof StorageType]}
                    />
                    <br />
                    <Link to={getNewProjectRoute(StorageType[key as keyof typeof StorageType])}>
                        <Button icon="plus" size="small">New</Button>
                    </Link>
                    <br />
                    <br />
                </div>
            ))}
        </>
    );
}
