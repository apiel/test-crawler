import React, { ReactNode } from 'react';
import Card from 'antd/lib/card';
import Button from 'antd/lib/button';
import Typography from 'antd/lib/typography';
import Badge from 'antd/lib/badge';
import { useProject } from '../projects/useProject';
import { StorageType } from '../server/storage.typing';
import { timestampToString } from '../utils';
import { getColorByStatus } from '../diff/DiffZone';

export interface ChangeItem {
    key: string;
    type: string;
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
            />
        );
}

export const ApplyChangesCard = ({
    storageType,
    projectId,
    timestamp,
    setOpen,
}: {
    storageType: StorageType,
    projectId: string,
    timestamp: string,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
}) => {
    const { project } = useProject(storageType, projectId);

    return (
        <Card
            style={applyChangesStyle}
            size="small"
        >
            <p style={{ fontWeight: 'bold', marginBottom: 0 }}>{project?.name}</p>
            <p style={{ color: '#999', marginTop: 0 }}>{timestampToString(timestamp)}</p>
            <p>
                {/* packages/test-crawler/src-isomor/pages/PageImageDiffZone.tsx */}
                <span style={{
                    color: getColorByStatus('valid')
                }}>■</span> <b>6</b> valid
                <span style={{
                    marginLeft: 10,
                    color: getColorByStatus('report')
                }}>■</span> <b>4</b> report
                <span style={{
                    marginLeft: 10,
                    color: getColorByStatus('pin')
                }}>■</span> <b>7</b> pin
            </p>
            <div style={{ textAlign: 'center' }}>
                <Button icon="shrink" size="small" onClick={() => setOpen(false)}>Reduce</Button>
                &nbsp;
                <Button size="small" icon="check">Apply</Button>
            </div>

        </Card>
    );
}
