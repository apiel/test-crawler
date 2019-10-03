import React from 'react';
import Icon from 'antd/lib/icon';
import Modal from 'antd/lib/modal';
import { DiffImage } from '../diff/DiffImage';
import { PngDiffData } from 'test-crawler-lib';

const onClick = (setVisible: React.Dispatch<React.SetStateAction<boolean>>) => () => {
    setVisible(true);
}

const onCancel = (setVisible: React.Dispatch<React.SetStateAction<boolean>>) => () => {
    setVisible(false);
}

interface Props {
    timestamp: string;
    id: string;
    png: {
        width: number;
        diff?: PngDiffData;
    };
}

export const PagesActionFullscreen = ({ timestamp, id, png }: Props) => {
    const [visible, setVisible] = React.useState<boolean>(false);
    return (
        <>
            <Modal
                title="Basic Modal"
                visible={visible}
                onCancel={onCancel(setVisible)}
                footer={null}
                width={png.width + 40}
            >
                <DiffImage
                    folder={timestamp}
                    id={id}
                    zones={png.diff && png.diff.zones}
                    originalWidth={png.width}
                    width={png.width}
                />
            </Modal>
            <Icon type="fullscreen" title="fullscreen" onClick={onClick(setVisible)} />
        </>
    );
}
