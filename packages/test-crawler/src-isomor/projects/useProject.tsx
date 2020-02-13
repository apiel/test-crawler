import React from 'react';
import { useAsyncCacheWatch } from 'react-async-cache';

import notification from 'antd/lib/notification';
import { loadProject } from '../server/service';
import { StorageType } from '../server/storage.typing';

export const useProject = (storageType: StorageType, projectId: string) => {
    const { call, response: project, update: setProject, error, cache } = useAsyncCacheWatch(
        () => loadProject(storageType, projectId),
    );

    React.useEffect(() => {
        if (!cache()) {
            call();
        }
    });
    if (error) {
        notification['warning']({
            message: 'Something went wrong while loading project.',
            description: error.toString(),
        });
    }
    return {
        project,
        setProject,
    };
}
