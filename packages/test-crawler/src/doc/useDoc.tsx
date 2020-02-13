import React, { ReactNode } from 'react'

const DocContext = React.createContext<{
    open: boolean,
    toggle: () => void,
    content?: ReactNode,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    setContent: React.Dispatch<React.SetStateAction<ReactNode>>,
}>({
    open: false,
    toggle: () => { },
    setOpen: () => { },
    setContent: () => { },
});

export function DocProvider({ children }: React.PropsWithChildren<any>) {
    const [open, setOpen] = React.useState(false);
    const [content, setContent] = React.useState<ReactNode>();
    return (
        <DocContext.Provider value={{
            open,
            setOpen,
            content,
            setContent,
            toggle: () => setOpen(!open),
        }}>
            {children}
        </DocContext.Provider>
    );
}

export const useDoc = () => React.useContext(DocContext);
