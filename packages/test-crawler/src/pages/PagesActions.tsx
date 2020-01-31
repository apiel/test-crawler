import React from 'react';
import { PngDiffData, PageData } from '../server/typing';

import { PagesActionZone } from './PagesActionZone';
import PagesActionPin from './PagesActionPin';
import { PagesActionFullscreen } from './PagesActionFullscreen';

interface Props {
    projectId: string;
    timestamp: string;
    id: string;
    url: string;
    pageError: any;
    png?: {
        width: number;
        diff?: PngDiffData;
    };
    setPages: React.Dispatch<React.SetStateAction<PageData[]>>;
}

export const PagesActions = ({ setPages, projectId, timestamp, id, png, url, pageError }: Props) => [
    ...[png && <PagesActionFullscreen setPages={setPages} projectId={projectId} png={png} id={id} timestamp={timestamp} url={url} pageError={pageError} />],
    <PagesActionZone type="check" timestamp={timestamp} id={id} status={'valid'} zones={png && png.diff ? png.diff.zones : []} />,
    <PagesActionZone type="warning" timestamp={timestamp} id={id} status={'report'} zones={png && png.diff ? png.diff.zones : []} />,
    <PagesActionPin timestamp={timestamp} id={id} />,
    // <Icon type="ellipsis" title="more" />,
];
