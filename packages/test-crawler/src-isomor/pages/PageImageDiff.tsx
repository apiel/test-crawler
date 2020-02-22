import React from 'react';
import Icon from 'antd/lib/icon';
import { PngDiffData } from 'test-crawler-core';

import { iconTheme } from './pageStyle';
import { sigDig } from '../utils';
import { PageImageDiffZone } from './PageImageDiffZone';

export const PageImageDiff = ({ diff }: { diff: PngDiffData }) => (
    <>
        <p>
            <Icon type="picture" theme={iconTheme} />
            &nbsp; Pixel diff ratio: {sigDig(diff.pixelDiffRatio)}
        </p>
        {diff.zones && diff.zones.length > 0 && (
            <PageImageDiffZone zones={diff.zones} />
        )}
    </>
);
