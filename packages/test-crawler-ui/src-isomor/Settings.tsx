import React from 'react';
import Typography from 'antd/lib/typography';

import { getDir } from './server/crawler';

const { Title } = Typography;

export const Settings = () => {
    const [libdir, setLibdir] = React.useState<string>('');
    const load = async () => {
        setLibdir(await getDir());
    }
    React.useEffect(() => { load(); }, []);

    return (
        <>
            <Title level={3}>Settings</Title>
            <p><b>Dir:</b> {libdir}</p>
        </>
    );
}
