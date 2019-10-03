import React from 'react';
import { PngDiffData } from 'test-crawler-lib';

import { PagesActionZone } from './PagesActionZone';
import PagesActionPin from './PagesActionPin';
import { PagesActionFullscreen } from './PagesActionFullscreen';

interface Props {
    timestamp: string;
    id: string;
    png?: {
        width: number;
        diff?: PngDiffData;
    };
}

export const PagesActions = ({ timestamp, id, png }: Props) => [
    ...[png && <PagesActionFullscreen png={png} id={id} timestamp={timestamp} />],
    <PagesActionZone type="check" timestamp={timestamp} id={id} status={'valid'} zones={png && png.diff ? png.diff.zones : []} />,
    <PagesActionZone type="warning" timestamp={timestamp} id={id} status={'report'} zones={png && png.diff ? png.diff.zones : []} />,
    <PagesActionPin timestamp={timestamp} id={id} />,
    // <Icon type="ellipsis" title="more" />,
];
