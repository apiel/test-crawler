import { SetZoneStatus } from './setZoneStatus';
import { CopyToPins, copyToPins } from './copyToPins';
export { copyToPins };
export declare type ChangesToApply = SetZoneStatus | CopyToPins;
export declare function applyChanges(changes: ChangesToApply[]): Promise<void>;
