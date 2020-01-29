import React from 'react';
import Card from 'antd/lib/card';
import Spin from 'antd/lib/spin';
import Masonry from 'react-masonry-component';
import { useAsyncCacheEffect } from 'react-async-cache';

import {
    masonryStyle,
    masonryOptions,
    cardStyle,
} from './pageStyle';
import { DiffImage } from '../diff/DiffImage'
import { PageData } from '../server/typing';
import { getPages } from '../server/service';
import { ErrorHandler } from '../common/ErrorHandler';
import { Search } from '../search/Search';
import { Page } from './Page';
import { PagesActions } from './PagesActions';
import { availableFilters } from '../search/search';
import { setMasonry, onMasonryImg } from '../common/refreshMasonry';

interface Props {
    projectId: string;
    timestamp: string;
    lastUpdate: number;
}

export const Pages = ({ projectId, timestamp, lastUpdate }: Props) => {
    const { response, error } = useAsyncCacheEffect<PageData[]>([lastUpdate], getPages, projectId, timestamp);
    if (error) {
        return <ErrorHandler description={error.toString()} />;
    }

    return (
        <Search response={response} withFilters={availableFilters}>
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
                                cover={png && <DiffImage
                                    projectId={projectId}
                                    folder={timestamp}
                                    id={id}
                                    zones={png.diff && png.diff.zones}
                                    originalWidth={png.width}
                                    onImg={onMasonryImg}
                                />}
                                actions={PagesActions({ id, timestamp, png, url, pageError })}
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
