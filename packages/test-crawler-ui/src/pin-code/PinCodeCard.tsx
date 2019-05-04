import React from 'react';
import Card from 'antd/lib/card';
import Icon from 'antd/lib/icon';

import { iconTheme } from '../pages/pageStyle';
import { DiffImage } from '../diff/DiffImage';
import { PngDiffData } from 'test-crawler-lib';
import { cardRightStyle } from './pinCodeStyle';

interface Props {
    id: string;
    url: string;
    png?: {
        width: number;
        diff?: PngDiffData;
    };
}
export const PinCodeCard = ({ id, png, url }: Props) => (
    <Card
        style={cardRightStyle}
        cover={png && <DiffImage folder='base' id={id} />}
    >
        <p><Icon type="link" /> <a href={url}>{url}</a></p>
        {!png && <p><Icon type="picture" theme={iconTheme} /> No screenshot available</p>}
    </Card>
);
