import React from 'react';
import Spin from 'antd/lib/spin';
import Typography from 'antd/lib/typography';
import Form from 'antd/lib/form';
import AceEditor from 'react-ace';
import { RouteComponentProps } from 'react-router';
import { Code as CodeType } from 'test-crawler-lib';
import { useAsyncCacheEffect } from 'react-async-cache';

import 'brace/mode/javascript';
import 'brace/theme/tomorrow';

import { PageData } from 'test-crawler-lib';
import { getPin, getCode } from '../server/service';
import { CodeInfo } from './CodeInfo';
import { aceEditorStyle } from './codeStyle';
import { CodeCard } from './CodeCard';
import { CodeForm } from './CodeFrom';
import { ErrorHandler } from '../common/ErrorHandler';

const { Title } = Typography;

const setSource = (
    code: CodeType,
    setCode: React.Dispatch<React.SetStateAction<CodeType | undefined>>,
) => (source: string) => {
    setCode({
        ...code,
        source,
    })
}

type Props = RouteComponentProps<{ id: string }>;

export const Code = ({ match: { params: { id } }, location }: Props) => {
    const { error, response: code, update: setCode } = useAsyncCacheEffect<CodeType>(getCode, id);
    if (error) {
        return <ErrorHandler description={error.toString()} />;
    }
    // instead to getPin, there should be a special endpoint retriving a
    // list of pages matching the pattern
    // (when it is coming from pin, pattern should be already be filled out)
    // const { response: pin } = useAsyncCacheEffect<PageData>(getPin, id);
    return (
        <>
            <Title level={3}>Add some code</Title>
            {
                code ? (
                    <Form>
                        <CodeInfo />
                        <CodeForm
                            id={id}
                            code={code}
                            setSource={setSource(code, setCode)}
                            location={location}
                        />
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
                        {/* {pin && <CodeCard id={pin.id} png={pin.png} url={pin.url} />} */}
                    </Form>
                ) : <Spin />
            }
        </>
    );
}
