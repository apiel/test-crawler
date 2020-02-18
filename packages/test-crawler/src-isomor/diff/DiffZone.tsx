import React, { useState } from 'react';
import Popover from 'antd/lib/popover';

import { DiffImageButtons } from './DiffImageButtons';
import { Zone, PageData, ChangeStatus } from '../server/typing';
import { StorageType } from '../server/storage.typing';

export const getColorByStatus = (status: ChangeStatus) => {
    if (status === ChangeStatus.valid || status === ChangeStatus.zonePin) {
        return '#0F0'; //'green';
    } else if (status === ChangeStatus.report) {
        return 'red';
    } else if (status === ChangeStatus.pin) {
        return 'blue';
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
    status: ChangeStatus,
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
    folder: string;
    id: string;
    zone: Zone;
    originalWidth: number;
    index: number;
    status: ChangeStatus;
    width: number;
    marginLeft: number;
    projectId: string;
    pages: PageData[];
    setPages: React.Dispatch<React.SetStateAction<PageData[]>>;
};

export const DiffZone = ({ storageType, thumb, pages, setPages, projectId, folder, id, index, originalWidth, zone, status, width, marginLeft }: Props) => {
    const [hover, setHover] = useState(false);
    const ratio = originalWidth / width;
    return (
        <Popover key={`${id}-${index}`} content={(
            <DiffImageButtons
                storageType={storageType}
                index={index}
                timestamp={folder}
                id={id}
                projectId={projectId}
                pages={pages}
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
