import React from 'react';
import Icon from 'antd/lib/icon';
import Menu from 'antd/lib/menu';
import Layout from 'antd/lib/layout';
import Typography from 'antd/lib/typography';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import './App.css';
import { New } from './New';
import { History } from './History';

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
    <Router>
        <Layout style={layoutStyle}>
            <Sider>
                <Title level={3} style={titleStyle}>
                    <Icon type="eye" /> Test-crawler
                </Title>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
                    <Menu.Item key="1">
                        <Icon type="plus" />
                        <span className="nav-text">New</span>
                        <Link to="/" />
                    </Menu.Item>
                    <Menu.Item key="2">
                        <Icon type="check" />
                        <span className="nav-text">Hist</span>
                        <Link to="/history/2" />
                    </Menu.Item>
                </Menu>
            </Sider>
            <Content style={contentStyle}>
                <Route path="/" exact component={New} />
                <Route path="/history/:id" component={History} />
            </Content>
        </Layout>
    </Router>
);

export default App;
