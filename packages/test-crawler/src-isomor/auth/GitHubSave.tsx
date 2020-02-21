import React from 'react';
import Modal from 'antd/lib/modal';
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';
import Cookies from 'universal-cookie';
import AES from 'crypto-js/aes';
import { MAX_AGE } from './githubCookie';

const handleCancel = (
    setToken: React.Dispatch<React.SetStateAction<string>>,
) => () => {
    setToken('');
}

const handleNever = (
    setToken: React.Dispatch<React.SetStateAction<string>>,
) => () => {
    const cookies = new Cookies();
    cookies.set('githubNoSave', 'true', { path: '/' });
    setToken('');
}

const handleSave = (
    setToken: React.Dispatch<React.SetStateAction<string>>,
    pass: string,
    token: string,
) => () => {
    if (pass.length) {
        const cookies = new Cookies();
        cookies.set('githubToken', AES.encrypt(token, pass).toString(), { path: '/' });
        setToken('');
    }
}

interface Props {
    token: string;
    setToken: React.Dispatch<React.SetStateAction<string>>;
}

export const GitHubSave = ({ token, setToken }: Props) => {
    // const cookies = new Cookies();
    // const encToken = cookies.get('githubToken');
    // console.log('encToken', encToken);
    // if (encToken) {
    //     var bytes  = AES.decrypt(cookies.get('githubToken'), 'hello');
    //     console.log('originalText', bytes.toString(encUtf8));
    // }

    const [pass, setPass] = React.useState('');
    return (
        <Modal
            visible={!!token.length}
            title="Keep token safe"
            onCancel={handleCancel(setToken)}
            footer={[
                <Button key="later" onClick={handleCancel(setToken)}>
                    Later
                </Button>,
                <Button key="never" onClick={handleNever(setToken)}>
                    Never
                </Button>,
                <Button key="save" onClick={handleSave(setToken, pass, token)}>
                    Save
                </Button>,
            ]}
        >
            <p style={{ textAlign: 'justify' }}>
                Personal access tokens is a sensible information and you should keep it safe. For this
                reason, we are saving this token in your cookie only for a limited amount of time. After
                { MAX_AGE } min of inactivity, you will need to enter it again.
            </p>
            <p style={{ textAlign: 'justify' }}>
                To keep this token safe, use some password manager like Lastpass or Bitwarden.
                Alternatively, you can use the build-in token AES encryption. Just set a password:
            </p>
            <Input.Password placeholder="Password" onChange={({ target: { value } }) => setPass(value)} />
        </Modal>
    );
}
