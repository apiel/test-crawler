import React from 'react';
import { PngDiffDataZone } from '../server/typing';

import { getColorByStatus } from '../diff/DiffZone';

const getCountZonesPerStatus = (zones: any, perStatus: string[]) =>
    zones.filter(({ status }: any) => perStatus.includes(status)).length

export const PageImageDiffZone = ({ zones }: {
    zones: PngDiffDataZone[]
}) => (
    <p>
        <b>Zone:</b>&nbsp;
            {[['diff'], ['valid', 'zone-pin'], ['report']].map(([status, ...more]) => (
            <React.Fragment key={status}>
                <span style={{
                    marginLeft: 10,
                    color: getColorByStatus(status)
                }}>■</span> <b>{getCountZonesPerStatus(zones, [status, ...more])}</b> {status}
            </React.Fragment>
        ))}
    </p>
);