import React, { useState, useEffect } from 'react';
import Popover from 'antd/lib/popover';

import {
    imgStyle,
    imgMargin,
} from '../pages/pageStyle';

import { DiffImageButtons } from './DiffImageButtons';
import { getThumbnail } from '../server/service';
import { Zone } from 'test-crawler-lib';

export const getColorByStatus = (status: string) => {
    if (status === 'valid' || status === 'pin') {
        return '#0F0'; //'green';
    } else if (status === 'report') {
        return 'red';
    }
    return 'yellow';
}

const zoneStyle = ({ xMin, yMin, xMax, yMax }: any, ratio: number, img: string | undefined, over: boolean, status: string) => {
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

interface Props {
    folder: string;
    id: string;
    zone: Zone;
    originalWidth: number;
    index: number;
    status: string;
};

export const DiffZone = ({ folder, id, index, originalWidth, zone, status }: Props) => {
    const [thumb, setThumb] = useState<string>();
    const load = async () => {
        setThumb(await getThumbnail('base', id, imgStyle.width));
    }
    useEffect(() => { load(); }, []);
    const [hover, setHover] = useState(false);
    const ratio = originalWidth / imgStyle.width;
    return (
        <Popover key={`${id}-${index}`} content={(
            <DiffImageButtons index={index} timestamp={folder} id={id} />
        )} trigger="click">
            <div
                style={zoneStyle(zone, ratio, thumb, hover, status) as any}
                onMouseOver={() => setHover(true)}
                onMouseOut={() => setHover(false)}
            />
        </Popover>
    );
}
