import React from 'react';
import Layout from 'antd/lib/layout';
import Typography from 'antd/lib/typography';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import './App.css';
import New from './New';
import { History } from './History';
import { SideMenu } from './SideMenu';
import { getHomeRoute, getHistoryRoute, getPinsRoute, getPinCodeRoute, getSettingsRoute } from './routes';
import { Pins } from './Pins';
import { PinCode } from './PinCode';
import { Settings } from './Settings';

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
                    Test-crawler
                </Title>
                <SideMenu />
            </Sider>
            <Content style={contentStyle}>
                <Route path={getHomeRoute()} exact component={New} />
                <Route path={getPinsRoute()} exact component={Pins} />
                <Route path={getSettingsRoute()} exact component={Settings} />
                <Route path={getPinCodeRoute(':id')} exact component={PinCode} />
                <Route path={getHistoryRoute(':timestamp')} component={History} />
            </Content>
        </Layout>
    </Router>
);

export default App;
