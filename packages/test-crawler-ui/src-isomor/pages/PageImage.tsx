import React from 'react';
import Tag from 'antd/lib/tag';
import Icon from 'antd/lib/icon';

import { iconTheme } from './pageStyle';
import { PngDiffData } from 'test-crawler-lib';
import { PageImageDiff } from './PageImageDiff';

export const PageImage = ({ diff }: {
    diff?: PngDiffData;
}) => (!diff)
        ? (
            <div>
                <Icon type="picture" theme={iconTheme} />&nbsp;
                New screenshot <Tag color="green">New</Tag>
            </div>
        ) : (
            <PageImageDiff diff={diff} />
        );