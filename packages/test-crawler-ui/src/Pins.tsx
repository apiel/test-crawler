import React from 'react';
import Spin from 'antd/lib/spin';
import Typography from 'antd/lib/typography';
import Card from 'antd/lib/card';
import Input from 'antd/lib/input';
import Icon from 'antd/lib/icon';
import Masonry from 'react-masonry-component';

import {
    masonryStyle,
    masonryOptions,
    cardStyle,
    iconTheme,
} from './pages/pageStyle';
import { DiffImage } from './diff/DiffImage';
import { getPins } from './server/crawler';
import { PageData } from 'test-crawler-lib';
import { Link } from 'react-router-dom';
import { getPinCodeRoute } from './routes';
import { getViewportName } from './viewport';
import { useAsyncCacheEffect } from 'react-async-cache';
import { ErrorHandler } from './ErrorHandler';
import { onSearch, searchStyle } from './search';

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
