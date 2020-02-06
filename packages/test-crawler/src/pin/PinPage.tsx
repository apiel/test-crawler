import React from 'react';
import Card from 'antd/lib/card';
import Icon from 'antd/lib/icon';
import message from 'antd/lib/message';
import Popconfirm from 'antd/lib/popconfirm';

import {
    cardStyle,
    iconTheme,
} from '../pages/pageStyle';
import { DiffImage } from '../diff/DiffImage';
import { PngDiffData, Viewport, PageData } from '../server/typing';
import { Link } from 'react-router-dom';
import { getCodeRoute } from '../routes';
import { getViewportName } from '../viewport';
import { removePin } from '../server/service';

const handleDelete = (
    projectId: string,
    id: string,
    setPins: React.Dispatch<React.SetStateAction<PageData[]>>,
) => async () => {
    const hide = message.loading('Delete in progress..', 0);
    const pins = await removePin(projectId, id);
    setPins(pins);
    hide();
}

interface Props {
    projectId: string;
    id: string;
    url: string;
    setPins: React.Dispatch<React.SetStateAction<PageData[]>>;
    viewport?: Viewport,
    onImg: () => void;
    png?: {
        width: number;
        diff?: PngDiffData;
    };
}

export const PinPage = ({ projectId, id, url, viewport, onImg, png, setPins }: Props) => (
    <Card
        style={cardStyle}
        cover={png && <DiffImage folder='base' id={id} onImg={onImg} projectId={projectId} />}
        actions={[
            <Popconfirm
                title="Are you sure delete this pin?"
                onConfirm={handleDelete(projectId, id, setPins)}
                okText="Yes"
                cancelText="No"
            >
                <Icon type="delete" title={`Delete pin`} />
            </Popconfirm>,
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
