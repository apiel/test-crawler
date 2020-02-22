import React from 'react';
import Spin from 'antd/lib/spin';
import Typography from 'antd/lib/typography';
import Form from 'antd/lib/form';
import AceEditor from 'react-ace';
import { RouteComponentProps } from 'react-router';

import 'brace/mode/javascript';
import 'brace/theme/tomorrow';

import { getCode } from '../server/service';
import { CodeInfo } from './CodeInfo';
import { aceEditorStyle } from './codeStyle';
import { CodeForm } from './CodeFrom';
import { ErrorHandler } from '../common/ErrorHandler';
import { ProjectName } from '../projects/ProjectName';
import { useAsync } from '../hook/useAsync';
import { StorageType } from '../server/storage.typing';
import { useThisDoc } from '../doc/useDoc';
import { Code as CodeType } from '../server/typing';

const { Title } = Typography;

const setSource = (
    code: CodeType,
    setCode: React.Dispatch<React.SetStateAction<CodeType>>,
) => (source: string) => {
    setCode({
        ...code,
        source,
    })
}

type Props = RouteComponentProps<{ id: string, projectId: string, storageType: StorageType }>;

export const Code = ({ match: { params: { id, projectId, storageType } }, location }: Props) => {
    useThisDoc();
    const { error, result: code, setResult: setCode } = useAsync<CodeType>(() => getCode(storageType, projectId, id));
    if (error) {
        return <ErrorHandler description={error.toString()} />;
    }
    // instead to getPin, there should be a special endpoint retriving a
    // list of pages matching the pattern
    // (when it is coming from pin, pattern should be already be filled out)
    return (
        <>
            <Title level={3}>Add some code</Title>
            {
                code ? (
                    <Form>
                        <CodeInfo />
                        <ProjectName projectId={projectId} storageType={storageType} />
                        <CodeForm
                            projectId={projectId}
                            id={id}
                            code={code}
                            setSource={setSource(code, setCode)}
                            location={location as any}
                            storageType={storageType}
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
                    </Form>
                ) : <Spin />
            }
        </>
    );
}
