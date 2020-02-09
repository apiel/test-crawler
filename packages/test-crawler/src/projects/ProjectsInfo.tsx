import React from 'react';
import Typography from 'antd/lib/typography';
import { Info } from '../common/Info';
import { StorageType } from '../server/storage.typing';
import { getInfo } from '../server/service';
import { useAsync } from '../hook/useAsync';

interface Props {
    storageType: StorageType;
}

export const ProjectsInfo = ({ storageType }: Props) => {
    const { result: info } = useAsync<string>(() => getInfo(storageType));

    return !info ? null : (
        <Info>
            <Typography.Paragraph>
                {info}
            </Typography.Paragraph>
        </Info>
    );
}
