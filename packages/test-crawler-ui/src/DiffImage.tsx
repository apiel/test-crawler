import React, { useState, useEffect } from 'react';

import {
    coverStyle,
    imgStyle,
} from './pageStyle';

import './App.css';
import { getThumbnail } from './server/crawler';
import { DiffZone } from './DiffZone';

export const DiffImage = ({ folder, id, zones, originalWidth, onImg }: any) => {
    const [thumb, setThumb] = useState<string>();
    const load = async () => {
        setThumb(await getThumbnail(folder, id, imgStyle.width));
        onImg();
    }
    useEffect(() => { load(); }, []);
    return thumb ? (
        <div style={coverStyle as any}>
            {zones && zones.map(({ zone, status }: any, index: number) =>
                <DiffZone {...{ folder, id, index, originalWidth, zone, status }} key={`zone-${id}-${index}`} />)}
            <img style={imgStyle} alt="" src={thumb} />
        </div>) : null;
}
