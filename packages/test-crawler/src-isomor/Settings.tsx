import React from 'react';
import Typography from 'antd/lib/typography';
import Spin from 'antd/lib/spin';

import { getSettings, startCrawlers } from './server/service';
import Button from 'antd/lib/button';

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
            {settings ? (
                <>
                    <p><b>Dir:</b> {settings.dir}</p>
                </>
            ) : <Spin />}
            <p>
                <Button
                    icon="caret-right"
                    size="small"
                    onClick={startCrawlers}
                >
                    Start crawlers
                </Button>
            </p>
        </>
    );
}
