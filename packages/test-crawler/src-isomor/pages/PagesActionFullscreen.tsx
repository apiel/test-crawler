import React from 'react';
import Icon from 'antd/lib/icon';
import Modal from 'antd/lib/modal';
import { PngDiffData } from '../server/typing';
import { Page } from './Page';
import { DiffImageWithZone } from '../diff/DiffImageWithZone';

const onClick = (setVisible: React.Dispatch<React.SetStateAction<boolean>>) => () => {
    setVisible(true);
}

const onCancel = (setVisible: React.Dispatch<React.SetStateAction<boolean>>) => () => {
    setVisible(false);
}

interface Props {
    projectId: string;
    timestamp: string;
    id: string;
    url: string;
    pageError: any;
    png: {
        width: number;
        diff?: PngDiffData;
    };
}

export const PagesActionFullscreen = ({ projectId, timestamp, id, png, url, pageError }: Props) => {
    const [visible, setVisible] = React.useState<boolean>(false);
    return (
        <>
            <Modal
                title=""
                visible={visible}
                onCancel={onCancel(setVisible)}
                footer={null}
                width={png.width + 40}
            >
                <div style={{position: "relative"}}>
                    <DiffImageWithZone
                        projectId={projectId}
                        folder={timestamp}
                        id={id}
                        zones={png.diff && png.diff.zones}
                        originalWidth={png.width}
                        width={png.width}
                    />
                    <Page url={url} pageError={pageError} png={png} />
                </div>
            </Modal>
            <Icon type="fullscreen" title="fullscreen" onClick={onClick(setVisible)} />
        </>
    );
}
