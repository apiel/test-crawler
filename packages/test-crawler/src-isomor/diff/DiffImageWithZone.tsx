import React from 'react';

import {
    imgStyle,
} from '../pages/pageStyle';

import { DiffZone } from './DiffZone';
import { PngDiffDataZone, PageData } from '../server/typing';
import { Props as DiffImageProps, DiffImage } from './DiffImage';
import { useAsyncCacheWatch } from 'react-async-cache';
import { getThumbnail } from '../server/service';

interface Props {
    zones?: PngDiffDataZone[];
    originalWidth?: number;
    setPages: React.Dispatch<React.SetStateAction<PageData[]>>;
};

export const DiffImageWithZone = ({
    storageType,
    projectId,
    timestamp,
    id,
    zones,
    originalWidth = 0,
    width = imgStyle.width,
    setPages,
    marginLeft,
    ...props
}: Props & DiffImageProps) => {
    // we might not even need useAsyncCacheWatch
    const { call, response: thumb, cache } = useAsyncCacheWatch(getThumbnail, storageType, projectId, 'pin', id, width);

    React.useEffect(() => {
        if (zones && !cache()) {
            call();
        }
    }, [zones]);

    return (
        <DiffImage storageType={storageType} projectId={projectId} timestamp={timestamp} id={id} width={width} {...props}>
            {zones?.map(({ zone, status }: PngDiffDataZone, index: number) =>
                <DiffZone
                    storageType={storageType}
                    thumb={thumb}
                    projectId={projectId}
                    timestamp={timestamp}
                    id={id}
                    width={width}
                    index={index}
                    originalWidth={originalWidth}
                    marginLeft={marginLeft}
                    status={status}
                    zone={zone}
                    key={`zone-${id}-${index}`}
                    setPages={setPages}
                />)
            }
        </DiffImage>
    );
};
