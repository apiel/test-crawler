import React from 'react';
import Layout from 'antd/lib/layout';
import Typography from 'antd/lib/typography';
import { BrowserRouter as Router, Route } from 'react-router-dom';

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
