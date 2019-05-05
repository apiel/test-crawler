import React from 'react';
import Spin from 'antd/lib/spin';
import Typography from 'antd/lib/typography';
import Masonry from 'react-masonry-component';

import {
    masonryStyle,
    masonryOptions,
} from '../pages/pageStyle';
import { getPins } from '../server/crawler';
import { PageData } from 'test-crawler-lib';
import { useAsyncCacheEffect } from 'react-async-cache';
import { ErrorHandler } from '../common/ErrorHandler';
import { PinPage } from './PinPage';
import { Search } from '../search/Search';

const { Title } = Typography;

export const Pins = () => {
    const { response, error } = useAsyncCacheEffect<PageData[]>(getPins);
    if (error) {
        return <ErrorHandler description={error.toString()} />;
    }

    let masonry: any;
    let timer: NodeJS.Timer;
    const onImg = () => {
        if (masonry) masonry.layout();
        clearTimeout(timer);
        timer = setTimeout(() => {
            if (masonry) masonry.layout();
        }, 500);
    }
    return (
        <>
            <Title level={3}>Pins</Title>
            <Search response={response}>
                {(pins) => pins ? (
                    <Masonry
                        style={masonryStyle}
                        options={masonryOptions}
                        ref={(c: any) => { masonry = c && c.masonry; }}
                    >
                        {pins.map(({ id, url, png, viewport }: PageData) => (
                            <PinPage
                                id={id}
                                key={id}
                                url={url}
                                png={png}
                                viewport={viewport}
                                onImg={onImg}
                            />
                        ))}
                    </Masonry>
                ) : <Spin />
                }
            </Search>
        </>
    );
}
