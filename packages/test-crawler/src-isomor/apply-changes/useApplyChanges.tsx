import React from 'react';
import message from 'antd/lib/message';
import { StorageType } from '../server/storage.typing';
import { ChangeItem } from '../server/typing';
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
    const jsonChanges = localStorage.getItem('apply-changes');
    const initialChanges = jsonChanges ? JSON.parse(jsonChanges) : {};
    // ToDo if initial changes we should show an overlay and force then to apply or cancel
    const [changes, setChanges] = React.useState<Changes>(initialChanges);
    return (
        <ApplyChangesContext.Provider value={{
            changes,
            cancel: () => {
                setChanges({});
                localStorage.removeItem('apply-changes');
                // window.onbeforeunload = () => false;
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
                localStorage.setItem('apply-changes', JSON.stringify(changes));
                clearTimeout(messageTimer);
                messageTimer = setTimeout(() => message.success(`${Object.values(changes).length} changes waiting for approval.`, 1), 100);
            },
        }}>
            {children}
        </ApplyChangesContext.Provider>
    );
}

export const useApplyChanges = () => React.useContext(ApplyChangesContext);
