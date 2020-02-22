import React, { useState } from 'react';
import Popover from 'antd/lib/popover';
import { Zone, PageData, ZoneStatus } from 'test-crawler-core';

import { DiffImageButtons } from './DiffImageButtons';
import { StorageType } from '../server/storage.typing';

export const getColorByStatus = (status: ZoneStatus) => {
    if (status === ZoneStatus.valid || status === ZoneStatus.zonePin) {
        return '#0F0'; //'green';
    } else if (status === ZoneStatus.report) {
        return 'red';
    }
    return 'yellow';
}

const zoneStyle = (
    { xMin, yMin, xMax, yMax }: any,
    ratio: number,
    width: number,
    marginLeft: number,
    img: string | undefined,
    over: boolean,
    status: ZoneStatus,
) => {
    const top = yMin / ratio - 1;
    const left = xMin / ratio - 1;
    return ({
        width: (xMax - xMin) / ratio + 2,
        height: (yMax - yMin) / ratio + 2,
        // width: 200,
        // height: 100,
        top,
        left: left + marginLeft,
        border: `1px solid ${getColorByStatus(status)}`,
        position: 'absolute',
        backgroundImage: over ? `url("${img}")` : 'none',
        backgroundPosition: `${-(left + 1)}px ${-(top + 1)}px`,
        backgroundSize: width,
    });
}

interface Props {
    storageType: StorageType;
    thumb: string;
    timestamp: string;
    id: string;
    zone: Zone;
    originalWidth: number;
    index: number;
    status: ZoneStatus;
    width: number;
    marginLeft: number;
    projectId: string;
    setPages: React.Dispatch<React.SetStateAction<PageData[]>>;
};

export const DiffZone = ({ storageType, thumb, setPages, projectId, timestamp, id, index, originalWidth, zone, status, width, marginLeft }: Props) => {
    const [hover, setHover] = useState(false);
    const ratio = originalWidth / width;
    return (
        <Popover key={`${id}-${index}`} content={(
            <DiffImageButtons
                storageType={storageType}
                index={index}
                timestamp={timestamp}
                id={id}
                projectId={projectId}
                setPages={setPages}
            />
        )} trigger="click">
            <div
                style={zoneStyle(zone, ratio, width, marginLeft, thumb, hover, status) as any}
                onMouseOver={() => setHover(true)}
                onMouseOut={() => setHover(false)}
            />
        </Popover>
    );
}
