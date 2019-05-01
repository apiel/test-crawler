import React from 'react';
import Spin from 'antd/lib/spin';
import Typography from 'antd/lib/typography';
import Card from 'antd/lib/card';
import Input from 'antd/lib/input';
import Icon from 'antd/lib/icon';
import Masonry from 'react-masonry-component';
import Fuse from 'fuse.js';

import {
    masonryStyle,
    masonryOptions,
    cardStyle,
    iconTheme,
    cardWidth,
} from './pageStyle';
import { DiffImage } from './DiffImage';
import { getPins } from './server/crawler';
import { PageData } from 'test-crawler-lib';
import { Link } from 'react-router-dom';
import { getPinCodeRoute } from './routes';
import { getViewportName } from './viewport';
import { useAsyncCacheEffect } from 'react-async-cache';
import { ErrorHandler } from './ErrorHandler';

const { Title } = Typography;
const { Search } = Input;

const searchStyle = {
    width: cardWidth,
}

export const Pins = () => {
    const { response, error } = useAsyncCacheEffect<PageData[]>(getPins);
    if (error) {
        return <ErrorHandler description={error.toString()} />;
    }

    const [pins, setPins] = React.useState<PageData[]>();
    React.useEffect(() => {
        setPins(response);
    }, [response]);

    let timerSearch: NodeJS.Timer;
    const onSearch = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
        if (!value.length) {
            setPins(response);
        } else {
            const fuse = new Fuse(response, {
                keys: [
                    'url',
                    'viewport.width',
                    'viewport.height',
                ],
            });
            clearTimeout(timerSearch);
            timerSearch = setTimeout(() => {
                setPins(fuse.search(value));
            }, 500);
        }
    };

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
                onChange={onSearch}
                style={searchStyle}
                allowClear
            />
            {
                pins ? (
                    <Masonry
                        style={masonryStyle}
                        options={masonryOptions}
                        ref={(c: any) => { masonry = c && c.masonry; }}
                    >
                        {pins.map(({ id, url, png, viewport }: any) => (
                            <Card
                                key={id}
                                style={cardStyle}
                                cover={png && <DiffImage folder='base' id={id} onImg={onImg} />}
                                actions={[
                                    <Icon type="delete" title={`Delete pin`} />,
                                    (<Link to={getPinCodeRoute(id)}>
                                        <Icon type="code" title={`Insert code while crawling`} />
                                    </Link>),
                                ]}
                            >
                                <p><Icon type="link" /> <a href={url}>{url}</a></p>
                                {!png && <p><Icon type="picture" theme={iconTheme} /> No screenshot available</p>}
                                {viewport && <p><Icon type="picture" theme={iconTheme} /> {getViewportName(viewport)}</p>}
                            </Card>
                        ))}
                    </Masonry>
                ) : <Spin />
            }
        </>
    );
}
