// deactivate for the moment
// we will need to find a way to load matching pined page

import React from 'react';
import Card from 'antd/lib/card';
import Icon from 'antd/lib/icon';

import { iconTheme } from '../pages/pageStyle';
import { DiffImage } from '../diff/DiffImage';
import { PngDiffData } from '../server/typing';
import { cardRightStyle } from './codeStyle';

interface Props {
    id: string;
    url: string;
    png?: {
        width: number;
        diff?: PngDiffData;
    };
}
// ToDo fix projectId
export const CodeCard = ({ id, png, url }: Props) => (
    <Card
        style={cardRightStyle}
        cover={png && <DiffImage folder='base' id={id} projectId="yoyo" />}
    >
        <p><Icon type="link" /> <a href={url}>{url}</a></p>
        {!png && <p><Icon type="picture" theme={iconTheme} /> No screenshot available</p>}
    </Card>
);
