import React from 'react';
import { PngDiffData } from 'test-crawler-lib';
import Icon from 'antd/lib/icon';

import { PagesActionZone } from './PagesActionZone';
import PagesActionPin from './PagesActionPin';

interface Props {
    timestamp: string;
    id: string;
    png?: {
        width: number;
        diff?: PngDiffData;
    };
}

export const PagesActions = ({ timestamp, id, png }: Props) => [
    <Icon type="fullscreen" title="fullscreen" />,
    <PagesActionZone type="check" timestamp={timestamp} id={id} status={'valid'} zones={png && png.diff ? png.diff.zones : []} />,
    <PagesActionZone type="warning" timestamp={timestamp} id={id} status={'report'} zones={png && png.diff ? png.diff.zones : []} />,
    <PagesActionPin timestamp={timestamp} id={id} />,
    // <Icon type="ellipsis" title="more" />,
];
