import React from 'react';
import Spin from 'antd/lib/spin';
import Typography from 'antd/lib/typography';
import notification from 'antd/lib/notification';
import AceEditor from 'react-ace';
import { RouteComponentProps } from 'react-router';

import 'brace/mode/javascript';
import 'brace/theme/tomorrow';

import { PageData } from 'test-crawler-lib';
import { getPin, getCode } from '../server/crawler';
import { CodeInfo } from './CodeInfo';
import { aceEditorStyle } from './codeStyle';
import { CodeCard } from './CodeCard';
import { CodeButtons } from './CodeButtons';

const { Title } = Typography;

const load = async (
    id: string,
    setPin: React.Dispatch<React.SetStateAction<PageData | undefined>>,
    setCode: React.Dispatch<React.SetStateAction<string>>,
) => {
    try {
        setPin(await getPin(id));
        const code = await getCode(id);
        if (code.length) {
            setCode(code);
        }
    } catch (error) {
        notification['error']({
            message: 'Something went wrong!',
            description: error.toString(),
        });
    }
}

export const Code = ({ match: { params: { id } } }: RouteComponentProps<{ id: string }>) => {
    const [code, setCode] = React.useState<string>(`module.exports = async function run(page) {\n// your code\n}`);
    const [pin, setPin] = React.useState<PageData>();

    React.useEffect(() => { load(id, setPin, setCode); }, []);

    return (
        <>
            <Title level={3}>Add some code</Title>
            {
                pin ? (
                    <>
                        <CodeInfo />
                        <CodeButtons id={id} code={code} setCode={setCode} />
                        <AceEditor
                            mode="javascript"
                            theme="tomorrow"
                            onChange={setCode}
                            fontSize={14}
                            value={code}
                            style={aceEditorStyle}
                        />
                        <CodeCard id={pin.id} png={pin.png} url={pin.url} />
                    </>
                ) : <Spin />
            }
        </>
    );
}
