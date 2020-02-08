import React, { useState, useEffect } from 'react';

import {
    coverStyle,
    imgStyle,
} from '../pages/pageStyle';

import { getThumbnail } from '../server/service';
import { StorageType } from '../server/typing';

export interface Props {
    storageType: StorageType;
    projectId: string;
    folder: string;
    id: string;
    width?: number;
    onImg?: () => void;
    marginLeft: number;
};

export const DiffImage = ({
    storageType,
    projectId,
    folder,
    id,
    onImg = () => { },
    width = imgStyle.width,
    children
}: Props & React.PropsWithChildren<any>) => {
    const [thumb, setThumb] = useState<string>();
    const load = async () => {
        setThumb(await getThumbnail(storageType, projectId, folder, id, width));
        onImg();
    }
    useEffect(() => { load(); }, []);
    return thumb ? (
        <div style={coverStyle as any}>
            {children}
            <img style={{ width }} alt="" src={thumb} />
        </div>) : null;
}
