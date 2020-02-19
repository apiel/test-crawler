import { SetZoneStatus, setZoneStatus } from './setZoneStatus';
import { CopyToPins, copyToPins } from './copyToPins';

export { copyToPins };

export type ChangesToApply = SetZoneStatus | CopyToPins;

export async function applyChanges(changes: ChangesToApply[]) {
    for (const change of changes) {
        if (change.type === 'copyToPins') {
            copyToPins(change.props);
        } else if (change.type === 'setZoneStatus') {
            setZoneStatus(change.props);
        }
    }
}
