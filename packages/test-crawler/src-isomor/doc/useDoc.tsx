import React, { ReactNode } from 'react';
import Cookies from 'universal-cookie';

const DocContext = React.createContext<{
    open: boolean,
    toggle: () => void,
    content?: ReactNode,
    setOpen: (value: boolean) => void,
    setContent: React.Dispatch<React.SetStateAction<ReactNode>>,
}>({
    open: false,
    toggle: () => { },
    setOpen: () => { },
    setContent: () => { },
});

export function DocProvider({ children }: React.PropsWithChildren<any>) {
    const cookies = new Cookies();
    const [open, setStateOpen] = React.useState(cookies.get('doc') === 'open');
    const [content, setContent] = React.useState<ReactNode>();
    const setOpen = (value: boolean) => {
        cookies.set('doc', value ? 'open' : 'close', { path: '/' });
        setStateOpen(value);
    }
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

export const useThisDoc = (content?: ReactNode) => {
    const { setContent } = useDoc();
    React.useEffect(() => {
        setContent(content);
    }, []);
}
