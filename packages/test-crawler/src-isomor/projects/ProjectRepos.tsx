import React from 'react';
import Select from 'antd/lib/select';
import Cookies from 'universal-cookie';

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
            onChange={(value: string) => {
                const cookies = new Cookies();
                cookies.set('githubRepo', value, { path: '/' });
            }}
            style={{ width: 200 }}
            placeholder="repository"
        >
            {repos.map(repo => (<Select.Option key={repo} value={repo}>{repo}</Select.Option>))}
        </Select>
    );
}
