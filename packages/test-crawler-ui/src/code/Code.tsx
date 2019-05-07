import React from 'react';
import Spin from 'antd/lib/spin';
import Input from 'antd/lib/input';
import Typography from 'antd/lib/typography';
import notification from 'antd/lib/notification';
import Form, { FormComponentProps } from 'antd/lib/form';
import AceEditor from 'react-ace';
import { RouteComponentProps } from 'react-router';
import { Code as CodeType } from 'test-crawler-lib';

import 'brace/mode/javascript';
import 'brace/theme/tomorrow';

import { PageData } from 'test-crawler-lib';
import { getPin, getCode } from '../server/service';
import { CodeInfo } from './CodeInfo';
import { aceEditorStyle } from './codeStyle';
import { CodeCard } from './CodeCard';
import { CodeForm } from './CodeFrom';

const { Title } = Typography;

const load = async (
    id: string,
    setPin: React.Dispatch<React.SetStateAction<PageData | undefined>>,
    setCode: React.Dispatch<React.SetStateAction<CodeType | undefined>>,
) => {
    try {
        setPin(await getPin(id));
        setCode(await getCode(id));
    } catch (error) {
        notification['error']({
            message: 'Something went wrong!',
            description: error.toString(),
        });
    }
}

const setSource = (
    code: CodeType,
    setCode: React.Dispatch<React.SetStateAction<CodeType>>,
) => (source: string) => {
    setCode({
        ...code,
        source,
    })
}

type Props = RouteComponentProps<{ id: string }>;

export const Code = ({ match: { params: { id } } }: Props) => {
    const [code, setCode] = React.useState<CodeType>();
    const [pin, setPin] = React.useState<PageData>();

    React.useEffect(() => { load(id, setPin, setCode); }, []);

    return (
        <>
            <Title level={3}>Add some code</Title>
            {
                pin && code ? (
                    <Form>
                        <CodeInfo />
                        <CodeForm id={id} code={code} setSource={setSource(code, setCode)} />
                        <AceEditor
                            mode="javascript"
                            theme="tomorrow"
                            onChange={setSource(code, setCode)}
                            fontSize={14}
                            value={code.source.length
                                ? code.source
                                : `module.exports = async function run(page) {\n// your code\n}`}
                            style={aceEditorStyle}
                        />
                        <CodeCard id={pin.id} png={pin.png} url={pin.url} />
                    </Form>
                ) : <Spin />
            }
        </>
    );
}
