import React from 'react';
import Typography from 'antd/lib/typography';
import { Info } from '../common/Info';
import Form, { FormComponentProps } from 'antd/lib/form';
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';
import Cookies from 'universal-cookie';

const handleSubmit = (validateFields: any) => (event: React.FormEvent<any>) => {
    event.preventDefault();
    validateFields((err: any, values: any) => {
        if (!err) {
            // save
            const cookies = new Cookies();
            cookies.set('github', values, { path: '/' });
        }
    });
}

const GitHubAuthForm = ({ form: { getFieldDecorator, validateFields }}: FormComponentProps) => {
    return (
        <>
            <Typography.Title level={4}>GitHub</Typography.Title>
            <Info>
                <Typography.Paragraph>
                    In order to use <a href="https://developer.github.com/v3/" target="_blank" rel="noopener noreferrer">GitHub API</a>, you need to provide some information.
                    To be able to push data to your repository, we need a <a href="https://developer.github.com/v3/auth/#via-oauth-and-personal-access-tokens" target="_blank" rel="noopener noreferrer">personal access tokens</a>.
                    Note, the personal access tokens is a sensible information. Use this app, only on a trustable device.
                    To <a href="https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line" target="_blank" rel="noopener noreferrer">
                    create a token</a>, go in developer settings, personal access tokens and then generate new token. In most of the case
                    you will only need to give permission for <Typography.Text code>public_repo</Typography.Text>.
                </Typography.Paragraph>
            </Info>
            <Form onSubmit={handleSubmit(validateFields)}>
                <Form.Item>
                    {getFieldDecorator('user', {
                        rules: [{ required: true, message: 'Please provide your GitHub username.' }],
                    })(
                        <Input addonBefore="Username" placeholder="Github username" />
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('token', {
                        rules: [{ required: true, message: 'Please provide your personal access tokens.' }],
                    })(
                        <Input.Password addonBefore="Token" placeholder="Personal access tokens" />
                    )}
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        icon="github"
                        htmlType="submit"
                    >
                        OK
                    </Button>
            </Form.Item>
            </Form>
        </>
    );
}

export const GitHubAuth = Form.create({ name: 'github_auth' })(GitHubAuthForm);
