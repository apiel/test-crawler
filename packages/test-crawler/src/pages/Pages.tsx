import React from 'react';
import Card from 'antd/lib/card';
import Spin from 'antd/lib/spin';
import Masonry from 'react-masonry-component';

import {
    masonryStyle,
    masonryOptions,
    cardStyle,
    cardImgMargin,
} from './pageStyle';
import { PageData } from '../server/typing';
import { getPages } from '../server/service';
import { ErrorHandler } from '../common/ErrorHandler';
import { Search } from '../search/Search';
import { Page } from './Page';
import { PagesActions } from './PagesActions';
import { availableFilters } from '../search/search';
import { setMasonry, onMasonryImg } from '../common/refreshMasonry';
import { DiffImageWithZone } from '../diff/DiffImageWithZone';
import { useAsync } from '../hook/useAsync';
import { StorageType } from '../server/storage.typing';

interface Props {
    storageType: StorageType;
    projectId: string;
    timestamp: string;
    lastUpdate: number;
}

export const Pages = ({ projectId, timestamp, lastUpdate, storageType }: Props) => {
    const { result: pages, error, setResult: setPages } = useAsync<PageData[]>(
        () => getPages(storageType, projectId, timestamp),
        [lastUpdate],
    );
    if (error) {
        return <ErrorHandler description={error.toString()} />;
    }

    return (
        <Search response={pages} withFilters={availableFilters}>
            {(pagesFiltered) => pagesFiltered ? (
                <Masonry
                    style={masonryStyle}
                    options={masonryOptions}
                    ref={(c: any) => { setMasonry(c && c.masonry); }}
                >
                    {
                        pagesFiltered.map(({ id, url, png, error: pageError }: PageData) => (
                            <Card
                                key={id}
                                style={cardStyle}
                                cover={png && <DiffImageWithZone
                                    storageType={storageType}
                                    projectId={projectId}
                                    timestamp={timestamp}
                                    id={id}
                                    zones={png.diff && png.diff.zones}
                                    originalWidth={png.width}
                                    onImg={onMasonryImg}
                                    setPages={setPages}
                                    marginLeft={cardImgMargin}
                                />}
                                actions={PagesActions({ storageType, setPages, projectId, id, timestamp, png, url, pageError })}
                            >
                                <Page url={url} pageError={pageError} png={png} />
                            </Card>
                        ))
                    }
                </Masonry >
            ) : <Spin />
            }
        </Search>);
}
