import React from 'react';
import Typography from 'antd/lib/typography';
import Spin from 'antd/lib/spin';

import { getSettings, startCrawlers } from './server/service';
import Button from 'antd/lib/button';
import { StorageType } from './server/storage.typing';

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
                    onClick={() => {
                        startCrawlers(StorageType.Local);
                    }}
                >
                    Start crawlers
                </Button>
            </p>
        </>
    );
}
