import React from 'react';
import Select from 'antd/lib/select';
import message from 'antd/lib/message';
import { StorageType } from '../server/storage.typing';
import { loadRepos, getRepo } from '../server/service';
import { useAsync } from '../hook/useAsync';

interface Props {
    storageType: StorageType;
}

export const ProjectRepos = ({ storageType }: Props) => {
    const { result: repos } = useAsync<string[]>(() => loadRepos(storageType));
    const { result: repo } = useAsync<string>(() => getRepo(storageType));

    return !repos ? null : (
        <Select
            showSearch
            defaultValue={repo}
            onChange={() => message.info('to be implemented')}
            style={{ width: 200 }}
            placeholder="repository"
        >
            {repos.map(repo => (<Select.Option value={repo}>{repo}</Select.Option>))}
        </Select>
    );
}
