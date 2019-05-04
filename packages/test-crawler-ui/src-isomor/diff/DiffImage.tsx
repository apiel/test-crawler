import React, { useState, useEffect } from 'react';

import {
    coverStyle,
    imgStyle,
} from '../pages/pageStyle';

import { getThumbnail } from '../server/crawler';
import { DiffZone } from './DiffZone';
import { PngDiffDataZone } from 'test-crawler-lib';

interface Props {
    folder: string;
    id: string;
    zones?: PngDiffDataZone[];
    originalWidth?: number;
    onImg?: () => void;
};

export const DiffImage = ({ folder, id, zones, originalWidth = 0, onImg = () => {} }: Props) => {
    const [thumb, setThumb] = useState<string>();
    const load = async () => {
        setThumb(await getThumbnail(folder, id, imgStyle.width));
        onImg();
    }
    useEffect(() => { load(); }, []);
    return thumb ? (
        <div style={coverStyle as any}>
            {zones && zones.map(({ zone, status }: PngDiffDataZone, index: number) =>
                <DiffZone {...{ folder, id, index, originalWidth, zone, status }} key={`zone-${id}-${index}`} />)}
            <img style={imgStyle} alt="" src={thumb} />
        </div>) : null;
}
