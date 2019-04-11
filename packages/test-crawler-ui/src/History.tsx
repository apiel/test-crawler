import React from 'react';
import Spin from 'antd/lib/spin';

import Pages from './Pages';
import { CrawlerInfo } from './CrawlerInfo';

export const History = ({ getCrawler }: any) => getCrawler ? (
    <>
        <CrawlerInfo crawler={getCrawler} />
        <Pages timestamp={getCrawler.timestamp} />
    </>
) : <Spin />;

export default function (props: any) {
    return History(props);
}