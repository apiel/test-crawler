import React from 'react';
import Spin from 'antd/lib/spin';
import Typography from 'antd/lib/typography';
import Masonry from 'react-masonry-component';

import {
    masonryStyle,
    masonryOptions,
} from '../pages/pageStyle';
import { PageData, StorageType } from '../server/typing';
import { ErrorHandler } from '../common/ErrorHandler';
import { PinPage } from './PinPage';
import { Search } from '../search/Search';
import { setMasonry, onMasonryImg } from '../common/refreshMasonry';
import { RouteComponentProps } from 'react-router-dom';
import { ProjectName } from '../projects/ProjectName';
import { useAsync } from '../hook/useAsync';
import { getPins } from '../server/service';

const { Title } = Typography;

export const Pins = ({
    match: { params: { projectId, storageType } },
}: RouteComponentProps<{ projectId: string, storageType: StorageType }>) => {
    const { result, error, setResult: setPins } = useAsync<PageData[]>(
        () => getPins(storageType, projectId)
    );
    if (error) {
        return <ErrorHandler description={error.toString()} />;
    }

    return (
        <>
            <Title level={3}>Pins</Title>
            <ProjectName projectId={projectId} storageType={storageType} />
            <Search response={result}>
                {(pins) => pins ? (
                    <Masonry
                        style={masonryStyle}
                        options={masonryOptions}
                        ref={(c: any) => { setMasonry(c && c.masonry); }}
                    >
                        {pins.map(({ id, url, png, viewport }: PageData) => (
                            <PinPage
                                projectId={projectId}
                                id={id}
                                key={id}
                                url={url}
                                setPins={setPins}
                                png={png}
                                viewport={viewport}
                                onImg={onMasonryImg}
                                storageType={storageType}
                            />
                        ))}
                    </Masonry>
                ) : <Spin />
                }
            </Search>
        </>
    );
}
