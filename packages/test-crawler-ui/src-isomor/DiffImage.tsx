import React, { useState, useEffect } from 'react';
import Popover from 'antd/lib/popover';

import {
    coverStyle,
    imgStyle,
    imgMargin,
} from './pageStyle';

import './App.css';
import DiffImageButtons from './DiffImageButtons';
import { getThumbnail } from './server/crawler';
import { DiffZone } from './DiffZone';

export const getColorByStatus = (status: string) => {
    if (status === 'valid' || status === 'pin') {
        return '#0F0'; //'green';
    } else if (status === 'report') {
        return 'red';
    }
    return 'yellow';
}

const zoneStyle = ({ xMin, yMin, xMax, yMax }: any, ratio: number, img: string, over: boolean, status: string) => {
    const top = yMin / ratio;
    const left = xMin / ratio;
    return ({
        width: (xMax - xMin) / ratio + 1,
        height: (yMax - yMin) / ratio + 1,
        top,
        left: left + imgMargin,
        border: `1px solid ${getColorByStatus(status)}`,
        position: 'absolute',
        backgroundImage: over ? `url("${img}")` : 'none',
        backgroundPosition: `${-left}px ${-top}px`,
    });
}

export const DiffImage = ({ folder, id, zones, originalWidth }: any) => {
    const [thumb, setThumb] = useState<string>();
    const load = async () => {
        setThumb(await getThumbnail(folder, id, imgStyle.width));
    }
    useEffect(() => { load(); }, []);
    return thumb ? (
        <div style={coverStyle as any}>
            {zones && zones.map(({ zone, status }: any, index: number) =>
                <DiffZone {...{ folder, id, index, originalWidth, zone, status }} key={`zone-${id}-${index}`} />)}
            <img style={imgStyle} alt="" src={thumb} />
        </div>) : null;
}
