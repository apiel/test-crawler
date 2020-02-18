import React, { ReactNode } from 'react';
import Card from 'antd/lib/card';
import Button from 'antd/lib/button';
import Icon from 'antd/lib/icon';
import Badge from 'antd/lib/badge';
import { useProject } from '../projects/useProject';
import { StorageType } from '../server/storage.typing';
import { timestampToString } from '../utils';
import { getColorByStatus } from '../diff/DiffZone';
import { ChangeStatus } from '../server/typing';

export enum ChangeType {
    setZoneStatus = 'setZoneStatus',
}

export interface ChangeItem {
    key: string;
    type: ChangeType;
    args: any[],
}

const ApplyChangesContext = React.createContext<{
    changes: ChangeItem[],
    apply: () => Promise<void>,
    add: (changeItem: ChangeItem) => void,
}>({
    changes: [],
    apply: async () => { },
    add: () => { },
});

export function ApplyChangesProvider({ children }: React.PropsWithChildren<any>) {
    const [changes, setChanges] = React.useState<ChangeItem[]>([]);
    return (
        <ApplyChangesContext.Provider value={{
            changes,
            apply: async () => { },
            add: (changeItem: ChangeItem) => {
                const index = changes.findIndex(({ key }) => key === changeItem.key);
                if (index !== -1) {
                    changes[index] = changeItem;
                } else {
                    changes.push(changeItem);
                }
                setChanges([...changes]);
                console.log('changes', changes);
            },
        }}>
            {children}
        </ApplyChangesContext.Provider>
    );
}

export const useApplyChanges = () => React.useContext(ApplyChangesContext);

const applyChangesStyle = {
    position: 'fixed' as any,
    right: 30,
    top: 50,
    zIndex: 1000,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
}

export const ApplyChangesInfo = () => {
    const { changes } = useApplyChanges();
    const [open, setOpen] = React.useState(true);
    if (!changes?.length) {
        return null;
    }

    const [storageType, projectId, timestamp] = changes[0].args;
    const values = {
        valid: 0,
        report: 0,
        pin: 0,
    }
    changes.forEach(({ type, args }) => {
        if (type === ChangeType.setZoneStatus) {
            let [status] = args.reverse() as [ChangeStatus]; // status is last arg from args
            if (status === ChangeStatus.zonePin) status = ChangeStatus.valid;
            (values as any)[status]++;
        }
    });
    return !open ? (
        <Button
            style={applyChangesStyle}
            type="primary"
            size="small"
            onClick={() => setOpen(true)}
        >
            <Badge count={changes.length} style={applyChangesStyle}>View pending</Badge>
        </Button>
    ) : (
            <ApplyChangesCard
                setOpen={setOpen}
                storageType={storageType}
                projectId={projectId}
                timestamp={timestamp}
                values={values}
            />
        );
}

// need to add animation

export const ApplyChangesCard = ({
    storageType,
    projectId,
    timestamp,
    setOpen,
    values,
}: {
    storageType: StorageType,
    projectId: string,
    timestamp: string,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    values: {
        valid: number,
        report: number,
        pin: number,
    },
}) => {
    const { project } = useProject(storageType, projectId);

    return (
        <Card
            style={applyChangesStyle}
            size="small"
        >
            <Icon
                style={{
                    ...applyChangesStyle,
                    right: applyChangesStyle.right + 3,
                    top: applyChangesStyle.top + 3,
                    backgroundColor: '#fff',
                    color: '#999',
                    boxShadow: '0 0 0 1px #d9d9d9 inset',
                    borderRadius: 3,
                }}
                onClick={() => setOpen(false)}
                type="shrink"
            />
            <p style={{ fontWeight: 'bold', marginBottom: 0 }}>{project?.name}</p>
            <p style={{ color: '#999', marginTop: 0 }}>{timestampToString(timestamp)}</p>
            <p>
                {
                    Object.keys(values).map((key, index) => (<>
                        <span style={{
                            ...(index > 0 && { marginLeft: 10 }),
                            color: getColorByStatus(key as ChangeStatus)
                        }}>■</span> <b>{(values as any)[key]}</b> {key}
                    </>))
                }
            </p>
            <div style={{ textAlign: 'center' }}>
                <Button icon="undo" size="small">Cancel</Button>
                &nbsp;
                    <Button size="small" icon="check">Apply</Button>
            </div>

        </Card>
    );
}
