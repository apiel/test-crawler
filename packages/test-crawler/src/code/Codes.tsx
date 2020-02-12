import React from 'react';
import Spin from 'antd/lib/spin';
import List from 'antd/lib/list';
import Button from 'antd/lib/button';
import Typography from 'antd/lib/typography';
import { CodeInfoList, BeforeAfterType } from '../server/typing';

import { getCodes } from '../server/service';
import { CodeInfo } from './CodeInfo';
import { ErrorHandler } from '../common/ErrorHandler';
import { Link } from 'react-router-dom';
import { getCodeRoute } from '../routes';
import { useAsync } from '../hook/useAsync';
import { StorageType } from '../server/storage.typing';
import { ForEachPage } from './ForEachPage';
import { BeforeAfter } from './BeforeAfter';

const { Title, Text } = Typography;

interface Props {
    storageType: StorageType;
    projectId: string;
}
export const Codes = ({ projectId, storageType }: Props) => {
    const { error, result } = useAsync<CodeInfoList>(() => getCodes(storageType, projectId));
    if (error) {
        return <ErrorHandler description={error.toString()} />;
    }
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
