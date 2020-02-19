import React from 'react';
import Card from 'antd/lib/card';
import Button from 'antd/lib/button';
import message from 'antd/lib/message';
import Icon from 'antd/lib/icon';
import Badge from 'antd/lib/badge';
import { Prompt } from 'react-router-dom';
import { useProject } from '../projects/useProject';
import { StorageType } from '../server/storage.typing';
import { timestampToString } from '../utils';
import { getColorByStatus } from '../diff/DiffZone';
import { ChangeStatus, ChangeItem, ChangeType } from '../server/typing';
import { applyChanges } from '../server/service';

type Changes = { [key: string]: ChangeItem };

const ApplyChangesContext = React.createContext<{
    changes: Changes,
    apply: (storageType: StorageType) => () => Promise<void>,
    add: (changeItem: ChangeItem) => void,
    cancel: () => void,
}>({
    changes: {},
    apply: () => async () => { },
    cancel: () => { },
    add: () => { },
});

let messageTimer: NodeJS.Timeout;
export function ApplyChangesProvider({ children }: React.PropsWithChildren<any>) {
    const [changes, setChanges] = React.useState<Changes>({});
    return (
        <ApplyChangesContext.Provider value={{
            changes,
            cancel: () => {
                setChanges({});
                window.location.reload();
            },
            apply: (storageType: StorageType) => async () => {
                await applyChanges(storageType, Object.values(changes));
                setChanges({});
                message.success(`Changes submitted.`, 2);
            },
            add: (changeItem: ChangeItem) => {
                changes[changeItem.key] = changeItem;
                setChanges({ ...changes });
                clearTimeout(messageTimer);
                messageTimer = setTimeout(() => message.success(`${Object.values(changes).length} changes waiting for approval.`, 1), 100);
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
    const { changes, apply, cancel } = useApplyChanges();
    const [open, setOpen] = React.useState(true);
    if (!Object.values(changes).length) {
        window.onbeforeunload = () => false;
        return null;
    }
    window.onbeforeunload = () => true;

    const changesValues = Object.values(changes);
    const { storageType, item: { props: { projectId, timestamp } } } = changesValues[0];
    const values = {
        valid: 0,
        report: 0,
        pin: 0,
    }
    changesValues.forEach(({ item }) => {
        if (item.type === ChangeType.setZoneStatus) {
            let { status } = item.props;
            if (status === ChangeStatus.zonePin) status = ChangeStatus.valid;
            (values as any)[status]++;
        } else if (item.type === ChangeType.pin) {
            values.pin++;
        }
    });
    return <>
        <Prompt
            message='You have unsaved changes, are you sure you want to leave?'
        />
        {
            !open ? (
                <Button
                    style={applyChangesStyle}
                    type="primary"
                    size="small"
                    onClick={() => setOpen(true)}
                >
                    <Badge count={changesValues.length} style={applyChangesStyle}>View pending</Badge>
                </Button>
            ) : (
                    <ApplyChangesCard
                        setOpen={setOpen}
                        storageType={storageType}
                        projectId={projectId}
                        timestamp={timestamp}
                        values={values}
                        apply={apply}
                        cancel={cancel}
                    />
                )
            }
    </>
}

export const ApplyChangesCard = ({
    storageType,
    projectId,
    timestamp,
    setOpen,
    values,
    apply,
    cancel,
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
    apply: (storageType: StorageType) => () => Promise<void>,
    cancel: () => void,
}) => (
        <Card
            style={{ ...applyChangesStyle, animation: '0.1s ease-out 0s 1 slideInFromLeft', }}
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
            <ApplyChangesProjectName projectId={projectId} storageType={storageType} />
            <p style={{ color: '#999', marginTop: 0 }}>{timestampToString(timestamp)}</p>
            <p>
                {
                    Object.keys(values).map((key, index) => (<span key={`change-${key}`}>
                        <span style={{
                            ...(index > 0 && { marginLeft: 10 }),
                            color: getColorByStatus(key as ChangeStatus)
                        }}>■</span> <b>{(values as any)[key]}</b> {key}
                    </span>))
                }
            </p>
            <div style={{ textAlign: 'center' }}>
                <Button icon="undo" size="small" onClick={cancel}>Cancel</Button>
                &nbsp;
                <Button size="small" icon="check" onClick={apply(storageType)}>Apply</Button>
            </div>

        </Card>
    );

export const ApplyChangesProjectName = ({
    storageType,
    projectId,
}: {
    storageType: StorageType,
    projectId: string,
}) => {
    const { project } = useProject(storageType, projectId);

    return <p style={{ fontWeight: 'bold', marginBottom: 0 }}>{project?.name}</p>;
}
