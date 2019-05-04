import React from 'react';
import Typography from 'antd/lib/typography';
import Spin from 'antd/lib/spin';

import { getSettings, getLogs } from './server/crawler';

const { Title } = Typography;

const terminalStyle = {
    backgroundColor: '#03101d',
    color: '#FFF',
    padding: 10,
    height: 500,
    whiteSpace: 'pre-wrap' as any,
    borderLeft: 'solid 7px rgb(67, 83, 99)',
}

const loadLogs = async (setLogs: React.Dispatch<React.SetStateAction<string>>) => {
    setLogs(await getLogs());
    // setTimeout(loadLogs, 1000); // maybe better to refresh manually
}
const load = async (
    setSettings: React.Dispatch<any>,
    setLogs: React.Dispatch<React.SetStateAction<string>>,
) => {
    setSettings(await getSettings());
    loadLogs(setLogs);
}

export const Settings = () => {
    const [settings, setSettings] = React.useState();
    const [logs, setLogs] = React.useState<string>('');

    React.useEffect(() => { load(setSettings, setLogs); }, []);

    return (
        <>
            <Title level={3}>Settings</Title>
            { settings ? (
                <>
                    <p><b>Dir:</b> {settings.dir}</p>
                    <p><b>Log file:</b> {settings.logFile}</p>
                </>
            ) : <Spin /> }
            <pre style={terminalStyle}>
                {logs}
            </pre>
        </>
    );
}
