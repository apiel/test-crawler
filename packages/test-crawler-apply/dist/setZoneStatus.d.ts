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
export declare function setZoneStatus({ jsonFile, pinJsonFile, index, status, }: SetZoneStatusProps): Promise<any>;
