import React from 'react';
import Spin from 'antd/lib/spin';
import Typography from 'antd/lib/typography';
import Masonry from 'react-masonry-component';
import { PageData } from 'test-crawler-core';

import { masonryStyle, masonryOptions } from '../pages/pageStyle';
import { ErrorHandler } from '../common/ErrorHandler';
import { PinPage } from './PinPage';
import { Search } from '../search/Search';
import { setMasonry, onMasonryImg } from '../common/refreshMasonry';
import { RouteComponentProps } from 'react-router-dom';
import { ProjectName } from '../projects/ProjectName';
import { useAsync } from '../hook/useAsync';
import { getPins } from '../server/service';
import { StorageType } from '../server/storage.typing';
import { useThisDoc } from '../doc/useDoc';

const { Title } = Typography;

export const Pins = ({
    match: {
        params: { projectId, storageType },
    },
}: RouteComponentProps<{ projectId: string; storageType: StorageType }>) => {
    useThisDoc();
    const { result, error, setResult: setPins } = useAsync<PageData[]>(() =>
        getPins(storageType, projectId),
    );
    if (error) {
        return <ErrorHandler description={error.toString()} />;
    }

    return (
        <>
            <Title level={3}>Pins</Title>
            <ProjectName projectId={projectId} storageType={storageType} />
            <Search response={result}>
                {pins =>
                    pins ? (
                        <Masonry
                            style={masonryStyle}
                            options={masonryOptions}
                            ref={(c: any) => {
                                setMasonry(c && c.masonry);
                            }}
                        >
                            {pins.map(
                                ({
                                    id,
                                    url,
                                    png,
                                    viewport,
                                    timestamp,
                                }: PageData) => (
                                    <PinPage
                                        projectId={projectId}
                                        timestamp={timestamp}
                                        id={id}
                                        key={id}
                                        url={url}
                                        setPins={setPins}
                                        png={png}
                                        viewport={viewport}
                                        onImg={onMasonryImg}
                                        storageType={storageType}
                                    />
                                ),
                            )}
                        </Masonry>
                    ) : (
                        <Spin />
                    )
                }
            </Search>
        </>
    );
};
