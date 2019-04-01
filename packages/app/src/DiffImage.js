import React, { useState } from 'react';
import Popover from 'antd/lib/popover';

import {
    coverStyle,
    imgStyle,
    imgMargin,
} from './pageStyle';

import './App.css';
import DiffImageButtons from './DiffImageButtons';

const getColorByStatus = (status) => {
    if (status === 'valid') {
        return '#0F0'; //'green';
    } else if (status === 'report') {
        return 'red';
    }
    return 'yellow';
}

const zoneStyle = ({ xMin, yMin, xMax, yMax }, ratio, img, over, status) => {
    const top = yMin / ratio;
    const left = xMin / ratio;
    return ({
        width: (xMax - xMin) / ratio + 1,
        height: (yMax - yMin) / ratio + 1,
        top,
        left: left + imgMargin,
        border: `1px solid ${getColorByStatus(status)}`,
        position: 'absolute',
        backgroundImage: over ? `url("${img}")` : 'none', // url("${img}")  ${top} ${left}
        backgroundPosition: `${-left}px ${-top}px`,
    });
}

export const DiffImage = ({ folder, id, zones, originalWidth }) => (
    <div style={coverStyle}>
        {zones && zones.map(({ zone, status }, index) => {
            const [hover, setHover] = useState(false);
            const ratio = originalWidth / imgStyle.width;
            const img = `/api/crawler/thumbnail/base/${id}/${imgStyle.width}`;
            return (
                <Popover key={`${id}-${index}`} content={(
                    <DiffImageButtons index={index} timestamp={folder} id={id} />
                )} trigger="click">
                    <div
                        style={zoneStyle(zone, ratio, img, hover, status)}
                        onMouseOver={() => setHover(true)}
                        onMouseOut={() => setHover(false)}
                    />
                </Popover>
            );
        })}
        <img style={imgStyle} alt="" src={`/api/crawler/thumbnail/${folder}/${id}/${imgStyle.width}`} />
    </div>
);

// need to create mutation for btn
