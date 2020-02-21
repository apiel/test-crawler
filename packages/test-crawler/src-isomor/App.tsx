import React from 'react';
import Layout from 'antd/lib/layout';
import Typography from 'antd/lib/typography';
import Breadcrumb from 'antd/lib/breadcrumb';
import {
    // BrowserRouter,
    Route,
    Link,
    HashRouter,
} from 'react-router-dom';

import './App.css';
import { ReactComponent as Logo } from './logo.svg';
import NewProject from './projects/new/NewProject';
import { Projects } from './projects/Projects';
import { CrawlerResults } from './crawler/CrawlerResults';
import {
    getHomeRoute, getResultsRoute, getPinsRoute, getProjectRoute,
    getCodeRoute, getSettingsRoute, getNewProjectRoute, getGitHubAuthRoute
} from './routes';
import { Pins } from './pin/Pins';
import { Code } from './code/Code';
import { Settings } from './Settings';
import { Project } from './projects/Project';
import Menu from 'antd/lib/menu';
import Icon from 'antd/lib/icon';
import { ProjectBreadcrumb } from './projects/ProjectBreadcrumb';
import { CrawlerResultsBreadcrumb } from './crawler/CrawlerResultsBreadcrumb';
import { PinsBreadcrumb } from './pin/PinsBreadcrumb';
import { CodeBreadcrumb } from './code/CodeBreadcrumb';
import { DocSider } from './doc/DocSider';
import { useDoc } from './doc/useDoc';
import { githubRefresh } from './auth/githubCookie';
import { GitHubAuth } from './auth/GitHubAuth';

const { Content, Header } = Layout;
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

const App = () => {
    const { toggle } = useDoc();
    githubRefresh();
    return (
        // <BrowserRouter basename={process.env.PUBLIC_URL}>
        <HashRouter
        // basename={process.env.PUBLIC_URL}
        >
            <DocSider>
                <Layout style={layoutStyle}>
                    <Header>
                        <Link to={getHomeRoute()}>
                            <Title level={3} style={titleStyle}>
                                <Logo style={{ height: 32, width: 32, position: 'absolute', fill: '#8c8c8c', }} />
                                <span style={{ marginLeft: 45 }}>Test-crawler</span>
                            </Title>
                        </Link>
                        <Menu
                            theme="dark"
                            mode="horizontal"
                            selectable={false}
                            style={{ paddingTop: 10 }}
                        >
                            <Menu.Item key="projects">
                                <Icon type="folder" />
                                <span className="nav-text">Projects</span>
                                <Link to={getHomeRoute()} />
                            </Menu.Item>
                            <Menu.Item
                                key="doc"
                                title="Docs"
                                // style={{ float: 'right', padding: 0 }}
                                onClick={toggle}
                            >
                                <Icon type="question-circle" />
                                <span className="nav-text">Documentation</span>
                            </Menu.Item>
                            <Menu.Item key="settings" title="settings">
                                <Icon type="setting" />
                                <span className="nav-text">Settings</span>
                                <Link to={getSettingsRoute()} />
                            </Menu.Item>
                        </Menu>
                    </Header>
                    <Breadcrumb style={{ margin: '10px 0 0 10px' }}>
                        <Route path={getProjectRoute(':storageType', ':projectId')} exact component={ProjectBreadcrumb} />
                        <Route path={getResultsRoute(':storageType', ':projectId', ':timestamp')} exact component={CrawlerResultsBreadcrumb} />
                        <Route path={getPinsRoute(':storageType', ':projectId')} exact component={PinsBreadcrumb} />
                        <Route path={getCodeRoute(':storageType', ':projectId', ':id')} exact component={CodeBreadcrumb} />
                    </Breadcrumb>
                    <Content style={contentStyle}>
                        <Route path={getGitHubAuthRoute()} exact component={GitHubAuth} />
                        <Route path={getHomeRoute()} exact component={Projects} />
                        <Route path={getSettingsRoute()} exact component={Settings} />

                        <Route path={getNewProjectRoute(':storageType')} exact component={NewProject} />
                        <Route path={getPinsRoute(':storageType', ':projectId')} exact component={Pins} />
                        <Route path={getCodeRoute(':storageType', ':projectId', ':id')} exact component={Code} />
                        <Route path={getResultsRoute(':storageType', ':projectId', ':timestamp')} component={CrawlerResults} />
                        <Route path={getProjectRoute(':storageType', ':projectId')} exact component={Project} />
                    </Content>
                </Layout>
            </DocSider>
        </HashRouter>
        // </BrowserRouter>
    );
}

export default App;
