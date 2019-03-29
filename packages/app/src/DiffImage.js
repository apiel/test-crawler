import React from 'react';

import {
    coverStyle,
    imgStyle,
} from './pageStyle';

const zoneStyle = ({xMin, yMin, xMax, yMax}, ratio) => ({
    width: (xMax-xMin)/ratio,
    height: (yMax-yMin)/ratio,
    top: yMin/ratio,
    left: xMin/ratio + 10, // (320 - 300) / 2 need to put this in var
    border: '1px solid #0F0',
    position: 'absolute',
});

export const DiffImage = ({ folder, id, zones, ratio }) => (
    <div style={coverStyle}>
        {
            zones.map(zone => <div style={zoneStyle(zone, ratio)} />)
        }
        <img style={imgStyle} alt="" src={`/crawler/thumbnail/${folder}/${id}`} />
    </div>
);
