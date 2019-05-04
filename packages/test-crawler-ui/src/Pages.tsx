import React from 'react';
import Card from 'antd/lib/card';
import Spin from 'antd/lib/spin';
import Masonry from 'react-masonry-component';
import { useAsyncCacheEffect } from 'react-async-cache';

import PagesActionPin from './PagesActionPin';
import {
    masonryStyle,
    masonryOptions,
    cardStyle,
} from './pageStyle';
import { DiffImage } from './DiffImage'
import { PagesActionZone } from './PagesActionZone';
import { PageData } from 'test-crawler-lib';
import { getPages } from './server/crawler';
import { ErrorHandler } from './ErrorHandler';
import { PagesSearch } from './PagesSearch';
import { Page } from './Page';
import { PagesActions } from './PagesActions';

const useMasonry = (masonry: any) => {
    let timer: NodeJS.Timer;
    const onImg = () => {
        if (masonry) masonry.layout();
        clearTimeout(timer);
        timer = setTimeout(() => {
            if (masonry) masonry.layout();
        }, 500);
    }
    return onImg;
}

interface Props {
    timestamp: string;
    lastUpdate: number;
}

export const Pages = ({ timestamp, lastUpdate }: Props) => {
    const { response, error } = useAsyncCacheEffect<PageData[]>([lastUpdate], getPages, timestamp);
    if (error) {
        return <ErrorHandler description={error.toString()} />;
    }

    let masonry: any;
    let onImg = useMasonry(masonry);
    return (
        <PagesSearch response={response}>
            {(pagesFiltered) => pagesFiltered ? (
                <Masonry
                    style={masonryStyle}
                    options={masonryOptions}
                    ref={(c: any) => { masonry = c && c.masonry; }}
                >
                    {
                        pagesFiltered.map(({ id, url, png, error: pageError }: PageData) => (
                            <Card
                                key={id}
                                style={cardStyle}
                                cover={png && <DiffImage
                                    folder={timestamp}
                                    id={id}
                                    zones={png.diff && png.diff.zones}
                                    originalWidth={png.width}
                                    onImg={onImg}
                                />}
                                actions={PagesActions({ id, timestamp, png })}
                            >
                                <Page url={url} pageError={pageError} png={png} />
                            </Card>
                        ))
                    }
                </Masonry >
            ) : <Spin />
            }
        </PagesSearch>);
}
