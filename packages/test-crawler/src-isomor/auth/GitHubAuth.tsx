import React from 'react';
import Typography from 'antd/lib/typography';
import { Info } from '../common/Info';
import Form, { FormComponentProps } from 'antd/lib/form';
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';
import message from 'antd/lib/message';
import Icon from 'antd/lib/icon';
import Cookies from 'universal-cookie';
import encUtf8 from 'crypto-js/enc-utf8';
import AES from 'crypto-js/aes';

import { GitHubSave } from './GitHubSave';
import { MAX_AGE } from './githubCookie';

const handleSubmit = (validateFields: any) => (event: React.FormEvent<any>) => {
    event.preventDefault();
    validateFields((err: any, values: any) => {
        if (!err) {
            // save
            const cookies = new Cookies();
            cookies.set('github', values, { path: '/', maxAge: MAX_AGE * 60 });
            window?.location?.reload();
        }
    });
}

const handleBlur = (
    setShowSave: React.Dispatch<React.SetStateAction<string>>,
) => ({ target: { value } }: React.FocusEvent<HTMLInputElement>) => {
    if (value.length) {
        const cookies = new Cookies();
        if (cookies.get('githubNoSave') !== 'true' && !cookies.get('githubToken')) {
            setShowSave(value);
        }
    }
}

const handleUnlock = (
    setToken: React.Dispatch<React.SetStateAction<string>>,
) => () => {
    const cookies = new Cookies();
    const encToken = cookies.get('githubToken');
    if (encToken) {
        const pass = prompt('Please enter password to unlock token');
        if (pass?.length) {
            const bytes  = AES.decrypt(cookies.get('githubToken'), pass);
            if (bytes) {
                const token = bytes.toString(encUtf8);
                if (token.length) {
                    setToken(token);
                    return;
                }
            }
            message.error('Invalid password');
        }
    }
}

const GitHubAuthForm = ({ form: { getFieldDecorator, validateFields } }: FormComponentProps) => {
    const [showSave, setShowSave] = React.useState('');
    const [token, setToken] = React.useState('');
    const cookies = new Cookies();
    const saveTokenAvailable = cookies.get('githubNoSave') !== 'true' && !cookies.get('githubToken');
    return (
        <>
            <GitHubSave token={showSave} setToken={setShowSave} />
            <Typography.Title level={4}>GitHub</Typography.Title>
            <Info>
                <Typography.Paragraph>
                    To save data in your GitHub repository, we need to provide
                    a <a href="https://developer.github.com/v3/auth/#via-oauth-and-personal-access-tokens" target="_blank" rel="noopener noreferrer">personal access tokens</a> to
                    the <a href="https://developer.github.com/v3/" target="_blank" rel="noopener noreferrer">GitHub API</a>.
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
                        initialValue: token,
                        rules: [{ required: true, message: 'Please provide your personal access tokens.' }],
                    })(
                        <Input.Password
                            addonBefore="Token"
                            placeholder="Personal access tokens"
                            {...(saveTokenAvailable && { onBlur: handleBlur(setShowSave) })}
                            {...(cookies.get('githubToken') && { addonAfter: <Icon type="unlock" onClick={handleUnlock(setToken)} /> })}
                        />
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
