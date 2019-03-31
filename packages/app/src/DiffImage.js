import React, { useState } from 'react';
import Popover from 'antd/lib/popover';
import Button from 'antd/lib/button';

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
        left: left + imgMargin,
        border: '1px solid #0F0',
        position: 'absolute',
        backgroundImage: over ? `url("${img}")` : 'none', // url("${img}")  ${top} ${left}
        backgroundPosition: `${-left}px ${-top}px`,
    });
}

const buttonStyle = {
    marginLeft: 5,
    marginRight: 5,
}

export const DiffImage = ({ folder, id, zones, originalWidth }) => (
    <div style={coverStyle}>
        {zones && zones.map(({ zone, status }, index) => {
            const [hover, setHover] = useState(false);
            const ratio = originalWidth / imgStyle.width;
            const img = `/api/crawler/thumbnail/base/${id}/${imgStyle.width}`;
            return (
                <Popover content={(
                    <>
                        <Button style={buttonStyle} icon="check" size="small">Ignore</Button>
                        <Button style={buttonStyle} icon="pushpin" size="small">Always ignore</Button>
                        <Button style={buttonStyle} icon="warning" size="small" type="danger">Report</Button>
                    </>
                )} trigger="click">
                    <div
                        key={`${id}-${index}`}
                        style={zoneStyle(zone, ratio, img, hover)}
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
