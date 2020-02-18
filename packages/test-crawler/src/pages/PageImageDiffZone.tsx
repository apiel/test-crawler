import React from 'react';
import { PngDiffDataZone, ChangeStatus } from '../server/typing';

import { getColorByStatus } from '../diff/DiffZone';

const getCountZonesPerStatus = (zones: any, perStatus: ChangeStatus[]) =>
    zones.filter(({ status }: any) => perStatus.includes(status)).length

export const PageImageDiffZone = ({ zones }: {
    zones: PngDiffDataZone[]
}) => (
        <p>
            <b>Zone:</b>&nbsp;
            {[
                [ChangeStatus.diff],
                [ChangeStatus.valid, ChangeStatus.zonePin],
                [ChangeStatus.report],
            ].map(([status, ...more]) => (
                <React.Fragment key={status}>
                    <span style={{
                        marginLeft: 10,
                        color: getColorByStatus(status)
                    }}>■</span> <b>{getCountZonesPerStatus(zones, [status, ...more])}</b> {status}
                </React.Fragment>
            ))}
        </p>
    );