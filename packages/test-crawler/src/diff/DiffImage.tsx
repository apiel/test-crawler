import React, { useState, useEffect } from 'react';

import {
    coverStyle,
    imgStyle,
} from '../pages/pageStyle';

import { getThumbnail } from '../server/service';
import { DiffZone } from './DiffZone';
import { PngDiffDataZone } from '../server/typing';

interface Props {
    folder: string;
    id: string;
    zones?: PngDiffDataZone[];
    originalWidth?: number;
    width?: number;
    onImg?: () => void;
};

export const DiffImage = ({ folder, id, zones, originalWidth = 0, onImg = () => {}, width = imgStyle.width }: Props) => {
    const [thumb, setThumb] = useState<string>();
    const load = async () => {
        setThumb(await getThumbnail(folder, id, width));
        onImg();
    }
    useEffect(() => { load(); }, []);
    return thumb ? (
        <div style={coverStyle as any}>
            {zones && zones.map(({ zone, status }: PngDiffDataZone, index: number) =>
                <DiffZone {...{ folder, id, index, originalWidth, zone, status, width }} key={`zone-${id}-${index}`} />)}
            <img style={{ width }} alt="" src={thumb} />
        </div>) : null;
}
