import React from 'react';

import {
    coverStyle,
    imgStyle,
    imgMargin,
} from './pageStyle';

const zoneStyle = ({xMin, yMin, xMax, yMax}, ratio) => ({
    width: (xMax-xMin)/ratio,
    height: (yMax-yMin)/ratio,
    top: yMin/ratio,
    left: xMin/ratio + imgMargin,
    border: '1px solid #0F0',
    position: 'absolute',
});

export const DiffImage = ({ folder, id, zones, originalWidth }) => (
    <div style={coverStyle}>
        { zones.map(zone => <div style={zoneStyle(zone, originalWidth/imgStyle.width)} />) }
        <img style={imgStyle} alt="" src={`/crawler/thumbnail/${folder}/${id}/${imgStyle.width}`} />
    </div>
);
