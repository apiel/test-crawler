import React from 'react';
import List from 'antd/lib/list';
import Icon from 'antd/lib/icon';
import { Link } from 'react-router-dom';
import Typography from 'antd/lib/typography';
import { StorageType } from '../server/storage.typing';
import { getProjectRoute } from '../routes';
import { useProjects } from './useProjects';
import Spin from 'antd/lib/spin';
import { useError } from '../hook/useError';
import { ProjectRepos } from './ProjectRepos';
import { ProjectsInfo } from './ProjectsInfo';

interface Props {
    title: string;
    storageType: StorageType;
}

export const ProjectsPerRemote = ({ title, storageType }: Props) => {
    const { projects, loading, error, call } = useProjects(storageType);
    const ErrorComponent = useError(error);
    // console.log('ErrorComponent', ErrorComponent);
    if (ErrorComponent) {
        return <ErrorComponent />;
    }
    return (
        <>
            <Typography.Title level={4}>
                {title} <ProjectRepos storageType={storageType} loadProjects={call} />
            </Typography.Title>
            <ProjectsInfo storageType={storageType} />
            {loading ? <Spin /> : <List
                itemLayout="horizontal"
                bordered
                dataSource={projects}
                renderItem={({ id, name, crawlerInput: { url } }) => (
                    <List.Item
                        actions={[
                            <Link to={getProjectRoute(storageType, id)}>
                                Open
                            </Link>,
                        ]}
                    >
                        <List.Item.Meta
                            title={<Link to={getProjectRoute(storageType, id)}>
                                {name} <Icon type={storageType} />
                            </Link>}
                            description={url}
                        />
                    </List.Item>
                )}
            />}
        </>
    );
}
