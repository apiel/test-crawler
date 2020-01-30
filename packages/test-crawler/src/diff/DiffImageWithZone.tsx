import React from 'react';

import {
    imgStyle,
} from '../pages/pageStyle';

import { DiffZone } from './DiffZone';
import { PngDiffDataZone } from '../server/typing';
import { Props as DiffImageProps, DiffImage } from './DiffImage';

interface Props {
    zones?: PngDiffDataZone[];
    originalWidth?: number;
};

export const DiffImageWithZone = ({
    projectId,
    folder,
    id,
    zones,
    originalWidth = 0,
    width = imgStyle.width,
    ...props
}: Props & DiffImageProps) =>
    <DiffImage projectId={projectId} folder={folder} id={id} width={width} {...props}>
        {zones && zones.map(({ zone, status }: PngDiffDataZone, index: number) =>
            <DiffZone
                projectId={projectId}
                folder={folder}
                id={id}
                width={width}
                index={index}
                originalWidth={originalWidth}
                status={status}
                zone={zone}
                key={`zone-${id}-${index}`}
            />)}
    </DiffImage>