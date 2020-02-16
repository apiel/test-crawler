import React, { ReactNode } from 'react';

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
