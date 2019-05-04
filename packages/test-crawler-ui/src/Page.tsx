import React from 'react';
import Alert from 'antd/lib/alert';
import Icon from 'antd/lib/icon';
import { PngDiffData } from 'test-crawler-lib';

import { iconTheme } from './pageStyle';
import { PageImage } from './PageImage';

const alertStyle = {
    marginBottom: 10,
}

interface Props {
    pageError: any;
    url: string;
    png?: {
        width: number;
        diff?: PngDiffData;
    };
}

export const Page = ({ pageError, url, png }: Props) => {
    return (
        <>
            {pageError && <Alert message={pageError} type="warning" style={alertStyle} />}
            <p><Icon type="link" /> <a href={url}>{url}</a></p>
            {png
                ? <PageImage diff={png.diff} />
                : <p><Icon type="picture" theme={iconTheme} /> No screenshot available</p>
            }
        </>
    );
}
