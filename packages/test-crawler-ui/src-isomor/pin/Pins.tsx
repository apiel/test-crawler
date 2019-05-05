import React from 'react';
import Spin from 'antd/lib/spin';
import Typography from 'antd/lib/typography';
import Input from 'antd/lib/input';
import Masonry from 'react-masonry-component';

import {
    masonryStyle,
    masonryOptions,
} from '../pages/pageStyle';
import { getPins } from '../server/crawler';
import { PageData } from 'test-crawler-lib';
import { useAsyncCacheEffect } from 'react-async-cache';
import { ErrorHandler } from '../common/ErrorHandler';
import { onSearch, searchStyle } from '../search/search';
import { PinPage } from './PinPage';

const { Title } = Typography;
const { Search } = Input;

export const Pins = () => {
    const { response, error } = useAsyncCacheEffect<PageData[]>(getPins);
    if (error) {
        return <ErrorHandler description={error.toString()} />;
    }

    const [pins, setPins] = React.useState<PageData[]>();
    React.useEffect(() => {
        setPins(response);
    }, [response]);

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
            <Search
                placeholder="Search"
                onChange={onSearch(setPins, response)}
                style={searchStyle}
                allowClear
            />
            {pins ? (
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
        </>
    );
}
