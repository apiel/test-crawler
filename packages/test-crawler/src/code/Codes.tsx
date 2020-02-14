import React from 'react';
import Typography from 'antd/lib/typography';
import { BeforeAfterType } from '../server/typing';

import { StorageType } from '../server/storage.typing';
import { ForEachPage } from './ForEachPage';
import { BeforeAfter } from './BeforeAfter';

const { Title } = Typography;

interface Props {
    storageType: StorageType;
    projectId: string;
}
export const Codes = ({ projectId, storageType }: Props) => {
    return (
        <>
            <Title level={3}>Codes</Title>
            <ForEachPage projectId={projectId} storageType={storageType} />
            <br />
            <br />
            <BeforeAfter
                type={BeforeAfterType.Before}
                projectId={projectId}
                storageType={storageType}
                title="Before all"
                info="This script will run when the test-crawler is starting, to give you the possibility to setup a working environment, for example to start a test server."
            />
            <br />
            <br />
            <BeforeAfter
                type={BeforeAfterType.After}
                projectId={projectId}
                storageType={storageType}
                title="After all"
                info="This script will run when the test-crawler finish. You could for example use this script to send some notification."
                codeParam="totalDiffCount, totalErrorCount"
            />
        </>
    );
}
