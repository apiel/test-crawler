import React from 'react';
import { PngDiffData } from 'test-crawler-lib';

import { PagesActionZone } from './PagesActionZone';
import PagesActionPin from './PagesActionPin';
import { PagesActionFullscreen } from './PagesActionFullscreen';

interface Props {
    timestamp: string;
    id: string;
    url: string;
    pageError: any;
    png?: {
        width: number;
        diff?: PngDiffData;
    };
}

export const PagesActions = ({ timestamp, id, png, url, pageError }: Props) => [
    ...[png && <PagesActionFullscreen png={png} id={id} timestamp={timestamp} url={url} pageError={pageError} />],
    <PagesActionZone type="check" timestamp={timestamp} id={id} status={'valid'} zones={png && png.diff ? png.diff.zones : []} />,
    <PagesActionZone type="warning" timestamp={timestamp} id={id} status={'report'} zones={png && png.diff ? png.diff.zones : []} />,
    <PagesActionPin timestamp={timestamp} id={id} />,
    // <Icon type="ellipsis" title="more" />,
];
