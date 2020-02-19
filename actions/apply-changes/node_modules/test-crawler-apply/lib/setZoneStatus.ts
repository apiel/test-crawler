import { groupOverlappingZone } from 'pixdiff-zone';
import { readJson, writeFileAsync } from './utils';

export interface SetZoneStatusProps {
    jsonFile: string;
    pinJsonFile: string;
    index: number;
    status: string;
}
export interface SetZoneStatus {
    type: 'setZoneStatus';
    props: SetZoneStatusProps;
}
export async function setZoneStatus({
    jsonFile,
    pinJsonFile,
    index,
    status,
}: SetZoneStatusProps): Promise<any> {
    const data = await readJson(jsonFile);
    if (status === 'zone-pin') { // ChangeStatus.zonePin
        const pin = await readJson(pinJsonFile);

        if (pin?.png?.diff?.zones && data?.png?.diff?.zones) {
            pin.png.diff.zones.push({ ...data.png.diff.zones[index], status });
            const zones = pin.png.diff.zones.map((item: any) => item.zone);
            zones.sort((a: any, b: any) => a.xMin * a.yMin - b.xMin * b.yMin);
            const groupedZones = groupOverlappingZone(zones);
            pin.png.diff.zones = groupedZones.map(zone => ({ zone, status }));
        }
        await writeFileAsync(pinJsonFile, JSON.stringify(pin, null, 4));
    }
    if (data?.png?.diff?.zones) {
        data.png.diff.zones[index].status = status;
    }
    await writeFileAsync(jsonFile, JSON.stringify(data, null, 4));
    return data;
}