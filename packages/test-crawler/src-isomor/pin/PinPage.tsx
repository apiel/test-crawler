import React from 'react';
import Card from 'antd/lib/card';
import Icon from 'antd/lib/icon';
import message from 'antd/lib/message';

import {
    cardStyle,
    iconTheme,
} from '../pages/pageStyle';
import { DiffImage } from '../diff/DiffImage';
import { PngDiffData, Viewport } from '../server/typing';
import { Link } from 'react-router-dom';
import { getCodeRoute } from '../routes';
import { getViewportName } from '../viewport';

interface Props {
    projectId: string;
    id: string;
    url: string;
    viewport?: Viewport,
    onImg: () => void;
    png?: {
        width: number;
        diff?: PngDiffData;
    };
}

export const PinPage = ({ projectId, id, url, viewport, onImg, png }: Props) => (
    <Card
        style={cardStyle}
        cover={png && <DiffImage folder='base' id={id} onImg={onImg} projectId={projectId} />}
        actions={[
            <Icon type="delete" title={`Delete pin`} onClick={() => message.warn('To be implemented.', 2)} />,
            (<Link to={{
                pathname: getCodeRoute(projectId, id),
                state: { pattern: url }
            }}>
                <Icon type="code" title={`Insert code while crawling`} />
            </Link>),
        ]}
    >
        <p><Icon type="link" /> <a href={url}>{url}</a></p>
        {!png && <p><Icon type="picture" theme={iconTheme} /> No screenshot available</p>}
        {viewport && <p><Icon type="picture" theme={iconTheme} /> {getViewportName(viewport)}</p>}
    </Card>
);
