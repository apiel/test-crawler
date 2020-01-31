import React, { useState, useEffect } from 'react';
import Popover from 'antd/lib/popover';

import {
    imgMargin,
} from '../pages/pageStyle';

import { DiffImageButtons } from './DiffImageButtons';
import { getThumbnail } from '../server/service';
import { Zone, PageData } from '../server/typing';

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
    width: number;
    projectId: string;
    setPages: React.Dispatch<React.SetStateAction<PageData[]>>;
};

export const DiffZone = ({ setPages, projectId, folder, id, index, originalWidth, zone, status, width }: Props) => {
    const [thumb, setThumb] = useState<string>();
    const load = async () => {
        setThumb(await getThumbnail(projectId, 'base', id, width));
    }
    useEffect(() => { load(); }, []);
    const [hover, setHover] = useState(false);
    const ratio = originalWidth / width;
    return (
        <Popover key={`${id}-${index}`} content={(
            <DiffImageButtons index={index} timestamp={folder} id={id} projectId={projectId} setPages={setPages} />
        )} trigger="click">
            <div
                style={zoneStyle(zone, ratio, thumb, hover, status) as any}
                onMouseOver={() => setHover(true)}
                onMouseOut={() => setHover(false)}
            />
        </Popover>
    );
}
