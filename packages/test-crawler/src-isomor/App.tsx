import React from 'react';
import Layout from 'antd/lib/layout';
import Typography from 'antd/lib/typography';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import './App.css';
import NewProject from './new-project/NewProject';
import { Projects } from './projects/Projects';
import { CrawlerResults } from './crawler/CrawlerResults';
import { SideMenu } from './side-menu/SideMenu';
import {
    getHomeRoute, getResultsRoute, getPinsRoute, getProjectRoute,
    getCodeRoute, getSettingsRoute, getNewProjectRoute
} from './routes';
import { Pins } from './pin/Pins';
import { Code } from './code/Code';
import { Settings } from './Settings';
import { Project } from './projects/Project';
import Menu from 'antd/lib/menu';
import Icon from 'antd/lib/icon';

const { Sider, Content, Header } = Layout;
const { Title } = Typography;

const layoutStyle = {
    minHeight: '100vh',
};
const titleStyle = {
    color: '#fff',
    marginTop: 15,
    marginRight: 15,
    float: 'left' as any,
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
            <Header>
                <Link to={getHomeRoute()}>
                    <Title level={3} style={titleStyle}>
                        Test-crawler
                    </Title>
                </Link>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    style={{ lineHeight: '64px' }}
                >
                    <Menu.Item key="projects">
                        <Icon type="folder" />
                        <span className="nav-text">Projects</span>
                        <Link to={getHomeRoute()} />
                    </Menu.Item>
                    <Menu.Item key="settings" style={{ float: 'right' }} >
                        <Link to={getSettingsRoute()}>
                            <Icon type="setting" />
                        </Link>
                    </Menu.Item>
                </Menu>
            </Header>
            <Content style={contentStyle}>
                <Route path={getHomeRoute()} exact component={Projects} />
                <Route path={getNewProjectRoute()} exact component={NewProject} />
                <Route path={getPinsRoute(':projectId')} exact component={Pins} />
                <Route path={getSettingsRoute()} exact component={Settings} />
                <Route path={getCodeRoute(':projectId', ':id')} exact component={Code} />
                <Route path={getResultsRoute(':projectId', ':timestamp')} component={CrawlerResults} />
                <Route path={getProjectRoute(':projectId')} exact component={Project} />
            </Content>
        </Layout>
    </Router>
);

export default App;
