import React from 'react';
import Icon from 'antd/lib/icon';
import Layout from 'antd/lib/layout';
import Typography from 'antd/lib/typography';

import { Page } from './Page'

import './App.css';

const { Sider, Content } = Layout;
const { Title } = Typography;

const layoutStyle = {
    minHeight: '100vh',
};
const titleStyle = {
    color: '#fff',
    margin: 10,
}
const contentStyle = {
    background: '#fff',
    padding: 24,
    margin: 10,
    minHeight: 280,
};

const App = () => (
    <Layout style={layoutStyle}>
        <Sider>
            <Title level={3} style={titleStyle}>
                <Icon type="eye" /> Test-crawler
            </Title>
            left sidebar
        </Sider>
        <Content style={contentStyle}>
            <Page />
        </Content>
    </Layout>
);

export default App;
