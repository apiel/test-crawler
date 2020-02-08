import React from 'react';
import { PngDiffData, PageData } from '../server/typing';

import { PagesActionZone } from './PagesActionZone';
import PagesActionPin from './PagesActionPin';
import { PagesActionFullscreen } from './PagesActionFullscreen';
import { StorageType } from '../server/storage.typing';

interface Props {
    storageType: StorageType;
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

export const PagesActions = ({ storageType, setPages, projectId, timestamp, id, png, url, pageError }: Props) => [
    ...[png && <PagesActionFullscreen storageType={storageType} setPages={setPages} projectId={projectId} png={png} id={id} timestamp={timestamp} url={url} pageError={pageError} />],
    <PagesActionZone storageType={storageType} type="check" setPages={setPages} projectId={projectId}  timestamp={timestamp} id={id} status={'valid'} />,
    <PagesActionZone storageType={storageType} type="warning" setPages={setPages} projectId={projectId} timestamp={timestamp} id={id} status={'report'} />,
    <PagesActionPin storageType={storageType} projectId={projectId} timestamp={timestamp} id={id} />,
    // <Icon type="ellipsis" title="more" />,
];
