import React from 'react';
import Typography from 'antd/lib/typography';
import Spin from 'antd/lib/spin';

import { getSettings } from './server/service';

const { Title } = Typography;

const load = async (
    setSettings: React.Dispatch<any>,
) => {
    setSettings(await getSettings());
}

export const Settings = () => {
    const [settings, setSettings] = React.useState();

    React.useEffect(() => { load(setSettings); }, []);

    return (
        <>
            <Title level={3}>Settings</Title>
            { settings ? (
                <>
                    <p><b>Dir:</b> {settings.dir}</p>
                </>
            ) : <Spin /> }
        </>
    );
}
