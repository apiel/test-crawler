import React from 'react';

import { useProject } from '../projects/useProject';
import { StorageType } from '../server/storage.typing';

export const ApplyChangesProjectName = ({
    storageType,
    projectId,
}: {
    storageType: StorageType,
    projectId: string,
}) => {
    const { project } = useProject(storageType, projectId);

    return <p style={{ fontWeight: 'bold', marginBottom: 0 }}>{project?.name}</p>;
}
