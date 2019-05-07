import React from 'react';
import Input from 'antd/lib/input';
import notification from 'antd/lib/notification';
import Icon from 'antd/lib/icon';
import Button from 'antd/lib/button';
import message from 'antd/lib/message';
import Dropdown from 'antd/lib/dropdown';
import Typography from 'antd/lib/typography';
import Form, { FormComponentProps } from 'antd/lib/form';

import { setCode } from '../server/service';
import { codeSnippet } from './CodeSnippet';
import { buttonBarStyle, buttonStyle, inputStyle } from './codeStyle';
import { Info } from '../common/Info';

const { Paragraph } = Typography;

interface FormInput {
    name: string,
    pattern: string,
}

const onPlay = () => {
    message.warn('To be implemented.', 2);
}

const save = async(
    id: string,
    source: string,
    info: FormInput,
) => {
    try {
        await setCode({
            id,
            source,
            ...info,
        });
        message.success('Code saved.', 2);
    } catch (error) {
        notification['error']({
            message: 'Something went wrong!',
            description: error.toString(),
        });
    }
}

const handleSubmit = (
    id: string,
    source: string,
    validateFields: any,
) => (event: React.FormEvent<FormInput>) => {
    event.preventDefault();
    validateFields((err: any, info: FormInput) => {
        if (!err) {
            save(id, source, info);
        }
    });
}

type Props = FormComponentProps & {
    id: string;
    code: string;
    setCode: React.Dispatch<React.SetStateAction<string>>;
};

const CodeFormComponent = ({ setCode, id, code, form: { getFieldDecorator, validateFields } }: Props) => {
    return (
        <Form onSubmit={handleSubmit(id, code, validateFields)}>
            <Form.Item style={inputStyle}>
                {getFieldDecorator('name', {
                    initialValue: '',
                })(
                    <Input addonBefore="Name" />
                )}
            </Form.Item>
            <Form.Item style={inputStyle}>
                {getFieldDecorator('pattern', {
                    rules: [{ required: true, message: 'Please input a pattern!' }],
                    initialValue: '',
                })(
                    <Input addonBefore="Pattern" />
                )}
            </Form.Item>
            <Info>
                <Paragraph>
                    Pattern is using <a href="https://www.npmjs.com/package/minimatch" target="_blank">minimatch</a> to
                    match the urls to inject the code.
                    It works by converting glob expressions into JavaScript RegExp objects.
                </Paragraph>
            </Info>
            <div style={buttonBarStyle}>
                <Button icon="save" htmlType="submit" style={buttonStyle}>Save</Button>
                <Button icon="caret-right" onClick={onPlay} style={buttonStyle}>Preview</Button>
                <Dropdown overlay={codeSnippet(setCode)}>
                    <Button style={buttonStyle}>
                        Code snippet <Icon type="down" />
                    </Button>
                </Dropdown>
            </div>
        </Form>
    );
}

export const CodeForm = Form.create<Props>({ name: 'code' })(CodeFormComponent);