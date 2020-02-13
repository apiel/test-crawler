import React from 'react';
import Layout from 'antd/lib/layout';
import Affix from 'antd/lib/affix';
import Button from 'antd/lib/button';
import { useDoc } from './useDoc';

export const DocSider = ({ children }: React.PropsWithChildren<any>) => {
    const { open, toggle, content } = useDoc();
    return (
        <Layout>
            {children}
            {!!open && <Layout.Sider
                theme="light"
                breakpoint="md"
                collapsedWidth="100%"
                width="40%"
                style={{
                    padding: 15,
                }}
            >
                <Affix offsetTop={10} style={{ marginBottom: 10 }}>
                    <Button
                        size="small"
                        shape="circle"
                        icon="close"
                        onClick={toggle}
                    />
                </Affix>
                {content || (<p>
                    We are sorry, there is no documentation for this section.
                    If you have any questions, please don't hesitate
                    to <a
                        href="https://github.com/apiel/test-crawler/issues"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        contact us
                    </a>.</p>)}
            </Layout.Sider>}
        </Layout>
    );
}
