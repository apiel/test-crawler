import React, { useState } from 'react';

import {
    coverStyle,
    imgStyle,
    imgMargin,
} from './pageStyle';

import './App.css';

const zoneStyle = ({ xMin, yMin, xMax, yMax }, ratio, img, over) => {
    const top = yMin / ratio;
    const left = xMin / ratio;
    return ({
        width: (xMax - xMin) / ratio + 1,
        height: (yMax - yMin) / ratio + 1,
        top,
        left: left  + imgMargin,
        border: '1px solid #0F0',
        position: 'absolute',
        backgroundImage: over ? `url("${img}")` : 'none', // url("${img}")  ${top} ${left}
        backgroundPosition: `${-left}px ${-top}px`,
    });
}

export const DiffImage = ({ folder, id, zones, originalWidth }) => (
    <div style={coverStyle}>
        {zones && zones.map((zone, index) => {
            const [hover, setHover] = useState(false);
            const ratio = originalWidth / imgStyle.width;
            const img = `/crawler/thumbnail/base/${id}/${imgStyle.width}`;
            return (<div
                key={`${id}-${index}`}
                style={zoneStyle(zone, ratio, img, hover)}
                onMouseOver={() => setHover(true)}
                onMouseOut={() => setHover(false)}
            />);
        })}
        <img style={imgStyle} alt="" src={`/crawler/thumbnail/${folder}/${id}/${imgStyle.width}`} />
    </div>
);
