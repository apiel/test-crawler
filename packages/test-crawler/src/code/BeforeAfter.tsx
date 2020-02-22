import React from 'react';
import message from 'antd/lib/message';
import Typography from 'antd/lib/typography';
import Button from 'antd/lib/button';
import notification from 'antd/lib/notification';
import AceEditor from 'react-ace';

import 'brace/mode/javascript';
import 'brace/theme/tomorrow';

import { getBeforeAfterCode, saveBeforeAfterCode } from '../server/service';
import { aceEditorStyle } from './codeStyle';
import { ErrorHandler } from '../common/ErrorHandler';
import { useAsync } from '../hook/useAsync';
import { StorageType } from '../server/storage.typing';
import { Info } from '../common/Info';
import { BeforeAfterType } from '../server/typing';

const { Title, Paragraph } = Typography;

const onSave = (
    code: string,
    type: BeforeAfterType,
    projectId: string,
    storageType: StorageType,
) => async () => {
    try {
        const hide = message.loading('Saving...', 0);
        await saveBeforeAfterCode(storageType, projectId, type, code);
        hide();
        message.success('Code saved.', 2);
    } catch (error) {
        notification['error']({
            message: 'Something went wrong!',
            description: error.toString(),
        });
    }
}

interface Props {
    type: BeforeAfterType;
    projectId: string;
    storageType: StorageType;
    title: string;
    info: string;
    codeParam?: string;
}

export const BeforeAfter = ({
    type,
    projectId,
    storageType,
    title,
    info,
    codeParam = '',
}: Props) => {
    const { error, result: code, setResult: setCode } = useAsync<string>(() => getBeforeAfterCode(storageType, projectId, type));
    if (error) {
        return <ErrorHandler description={error.toString()} />;
    }
    return (
        <>
            <Title level={4}>{title}</Title>
            <Info>
                <Paragraph>
                    {info}
                </Paragraph>
            </Info>
            <AceEditor
                mode="javascript"
                theme="tomorrow"
                onChange={setCode}
                fontSize={14}
                value={!!code?.length
                    ? code
                    : `module.exports = async function run(${codeParam}) {\n// your code\n}`}
                style={{ ...aceEditorStyle, height: 200 }}
            />
            <Button
                icon="save"
                size="small"
                onClick={onSave(code, type, projectId, storageType)}
            >
                Save
            </Button>
        </>
    );
}
