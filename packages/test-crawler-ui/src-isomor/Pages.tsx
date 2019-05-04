import React from 'react';
import Card from 'antd/lib/card';
import Spin from 'antd/lib/spin';
import Tag from 'antd/lib/tag';
import Alert from 'antd/lib/alert';
import Icon from 'antd/lib/icon';
import Masonry from 'react-masonry-component';
import { useAsyncCacheEffect } from 'react-async-cache';

import PagesActionPin from './PagesActionPin';
import {
    masonryStyle,
    masonryOptions,
    cardStyle,
    iconTheme,
} from './pageStyle';
import { DiffImage } from './DiffImage'
import { PagesActionZone } from './PagesActionZone';
import { PageData } from 'test-crawler-lib';
import { getPages } from './server/crawler';
import { getColorByStatus } from './DiffZone';
import { sigDig } from './utils';
import { ErrorHandler } from './ErrorHandler';
import { PagesSearch } from './PagesSearch';

const alertStyle = {
    marginBottom: 10,
}

const getCountZonesPerStatus = (zones: any, perStatus: string[]) =>
    zones.filter(({ status }: any) => perStatus.includes(status)).length

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
                        pagesFiltered.map(({ id, url, png, error: pageError }: any) => (
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
                                actions={[
                                    <PagesActionZone type="check" timestamp={timestamp} id={id} status={'valid'} zones={png && png.diff ? png.diff.zones : []} />,
                                    <PagesActionZone type="warning" timestamp={timestamp} id={id} status={'report'} zones={png && png.diff ? png.diff.zones : []} />,
                                    <PagesActionPin timestamp={timestamp} id={id} />,
                                    // <Icon type="ellipsis" title="more" />,
                                ]}
                            >
                                {pageError && <Alert message={pageError} type="warning" style={alertStyle} />}
                                <p><Icon type="link" /> <a href={url}>{url}</a></p>
                                {!png && <p><Icon type="picture" theme={iconTheme} /> No screenshot available</p>}
                                {png && !png.diff && <div><Icon type="picture" theme={iconTheme} /> New screenshot <Tag color="green">New</Tag></div>}
                                {png && png.diff && <>
                                    <p><Icon type="picture" theme={iconTheme} /> Pixel diff ratio: {sigDig(png.diff.pixelDiffRatio)}</p>
                                    {png.diff.zones.length > 0 &&
                                        <p>
                                            <b>Zone:</b>&nbsp;
                                    {[['diff'], ['valid', 'pin'], ['report']].map(([status, ...more]) => (
                                                <React.Fragment key={status}>
                                                    <span style={{
                                                        marginLeft: 10,
                                                        color: getColorByStatus(status)
                                                    }}>■</span> <b>{getCountZonesPerStatus(png.diff.zones, [status, ...more])}</b> {status}
                                                </React.Fragment>
                                            ))}
                                        </p>
                                    }
                                </>}
                            </Card>
                        ))
                    }
                </Masonry >
            ) : <Spin />
            }
        </PagesSearch>);
}
