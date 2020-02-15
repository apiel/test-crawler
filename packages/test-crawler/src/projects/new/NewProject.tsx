import React from 'react';
import Input from 'antd/lib/input';
import InputNumber from 'antd/lib/input-number';
import Checkbox from 'antd/lib/checkbox';
import Form, { FormComponentProps } from 'antd/lib/form';
import Icon from 'antd/lib/icon';
import Popover from 'antd/lib/popover';
import Radio from 'antd/lib/radio';
import Typography from 'antd/lib/typography';
import notification from 'antd/lib/notification';
import Button from 'antd/lib/button';
import { RouteComponentProps } from 'react-router';
import { CrawlerInput, Browser } from '../../server/typing';

import { getHomeRoute } from '../../routes';
import { saveProject } from '../../server/service';
import { Info } from '../../common/Info';
import { getDefaultViewport, viewportsStr } from '../../viewport';
import { History } from 'history';
import { StorageType } from '../../server/storage.typing';
import { ProjectRepos } from '../ProjectRepos';
import { useThisDoc } from '../../doc/useDoc';
import Select from 'antd/lib/select';

const save = async (
    storageType: StorageType,
    history: History<any>,
    { name, viewport, ...input }: (CrawlerInput & { name: string, viewport: string }),
) => {
    try {
        await saveProject(storageType, { ...input, viewport: JSON.parse(viewport) }, name, undefined);
        history.push(getHomeRoute());
    } catch (error) {
        notification['error']({
            message: 'Something went wrong!',
            description: error.toString(),
        });
    }
}

const handleSubmit = (storageType: StorageType, history: History<any>, validateFields: any) => (event: React.FormEvent<any>) => {
    event.preventDefault();
    validateFields((err: any, values: any) => {
        if (!err) {
            save(storageType, history, values);
        }
    });
}

type Props = FormComponentProps & RouteComponentProps<{ storageType: StorageType }>;
const NewProject = ({
    history,
    match: { params: { storageType } },
    form: { getFieldDecorator, validateFields, getFieldValue },
}: Props) => {
    useThisDoc(Doc);
    return (
        <Form onSubmit={handleSubmit(storageType, history, validateFields)}>
            <Form.Item>
                {getFieldDecorator('name', {
                    rules: [{ required: true, message: 'Please give a name to the project.' }],
                })(
                    <Input addonBefore="Name" placeholder="Project name" />
                )}
            </Form.Item>
            <Form.Item>
                {getFieldDecorator('url', {
                    rules: [{ required: true, message: 'Please input an URL to crawl.' }],
                })(
                    <Input
                        placeholder="https://domain.com/"
                        addonBefore="URL"
                    />
                )}
            </Form.Item>
            <div>
                <Form.Item label="Browser" className="item-inline">
                    {getFieldDecorator('browser', {
                        initialValue: Browser.ChromePuppeteer,
                        rules: [{ required: true, message: 'Please select a browser.' }],
                    })(
                        <Select>
                            {Object.keys(Browser).map(
                                (key) => <Select.Option key={key} value={Browser[key as keyof typeof Browser]}>{Browser[key as keyof typeof Browser]}</Select.Option>
                            )}
                        </Select>
                    )}
                </Form.Item>
                <Form.Item label="Viewport" className="item-inline">
                    {getFieldDecorator('viewport', {
                        initialValue: JSON.stringify(getDefaultViewport()),
                        rules: [{ required: true, message: 'Please select viewport.' }],
                    })(
                        <Select>
                            {viewportsStr.map(
                                ({ value, name }) => <Select.Option key={value} value={value}>{name}</Select.Option>
                            )}
                        </Select>
                    )}
                </Form.Item>
            </div>
            <div>
                <Form.Item label="Method" className="item-inline">
                    {getFieldDecorator('method', {
                        initialValue: 'spiderbot',
                        rules: [{ required: true }],
                    })(
                        <Radio.Group size="small">
                            <Radio.Button value={'spiderbot'}><Icon type="radar-chart" /> Spider bot</Radio.Button>
                            <Radio.Button value={'urls'}><Icon type="ordered-list" /> URLs list</Radio.Button>
                        </Radio.Group>
                    )}
                </Form.Item>
                {getFieldValue('method') === 'spiderbot' &&
                    <Form.Item label="Limit" className="item-inline">
                        {getFieldDecorator('limit')(
                            <InputNumber min={0} size="small" />
                        )}
                        &nbsp;<Popover content={<div>
                            <b>Limit the number of sibling pages. </b>
                            For example, with the urls:
                        <ul>
                                <li>/item/1</li>
                                <li>/item/2</li>
                                <li>/item/3</li>
                                <li>/item/4</li>
                            </ul> using the limit <b>2</b> will only crawl <b>/item/1</b> and <b>/item/2</b>.<br /><br />
                            Use <b>0</b> to skip the limit.</div>} trigger="click" overlayStyle={{ width: 200 }}>
                            <Icon type="question-circle" />
                        </Popover>
                    </Form.Item>
                }
                <Info>
                    <Typography.Paragraph ellipsis={{ rows: 1, expandable: true }}>
                        <b>Spider bot</b> crawling method will get all the links inside the page of the given URL
                        and crawl the children. It will then continue do the same with the children till no new
                        link is found. Be careful if you have big website, this is most likely not the right
                        solution for you.
                    </Typography.Paragraph>
                    <Typography.Paragraph ellipsis={{ rows: 1, expandable: true }}>
                        <b>URLs list</b> crawling method will crawl a specific sets of URLs. In the URL input field
                        you must provide an endpoint containing a list of URLs (a simple text format, with one URL
                        per line). The crawler will crawl each of those URL only and will not try to find links in
                        the page. To use a static list of URLs, you can use a tool
                        like <a href="https://pastebin.com" target="_blank" rel="noopener noreferrer">https://pastebin.com</a>.
                    </Typography.Paragraph>
                </Info>
            </div>
            <Form.Item>
                {getFieldDecorator('autopin', {
                    valuePropName: 'checked',
                })(
                    <Checkbox>Automatically pin new page founds.</Checkbox>
                )}
            </Form.Item>
            <Form.Item>
                <ProjectRepos storageType={storageType} />
            </Form.Item>
            <Form.Item>
                <Button
                    type="primary"
                    icon="plus"
                    htmlType="submit"
                >
                    Create
                </Button>
            </Form.Item>
        </Form>
    );
}

const NewForm = Form.create({ name: 'start_crawler' })(NewProject);
export default NewForm;

const Doc = () => (
    <>
        <p>
            First of all, you need to give a name to your project. Then, you need to
            provide the URL depending of the crawling method you will be using. If
            you are using the <b>Spider bot</b> method, you should give the URL of
            the website you want to crawl. If you are using the <b>URLs list</b> method,
            you should give the URL of the endpoint containing the list of URLs.
        </p>
        <p>
            There is different kind of browser: <a
                href="https://github.com/puppeteer/puppeteer"
                target="_blank" rel="noopener noreferrer"
            >chrome-puppeteer</a>, <a
                href="https://github.com/SeleniumHQ/selenium"
                target="_blank" rel="noopener noreferrer"
            >firefox-selenium</a>... Depending of the browser you will select, different tool
            will be available in the code injection. Also some brwoser are only available
            depending of the OS where is test-crawler hosted.
        </p>
        <Info>
            <p>IE, Edge and Safari are in experimentation, might not be stable.</p>
        </Info>
        <p>
            Running your test in safari work only on macOS. Safari doesn't support multiple instance
            in parallel, therefor crawling might be very slow. Locally, you will need to activate safari
            webdriver for selenium with the following commands:
        </p>
        <pre>
            <code>
                sudo safaridriver --enable
                safaridriver -p 0 &
            </code>
        </pre>
        <p>
            There is multiple viewports (screen size) available. If you want to test
            multiple viewports for the same website, you will have to create one
            project per viewport.
        </p>
        <p>
            Finally, you can specify if you want to automatically pin the new pages founds.
            Pins are the references screenshot to make the comparison with.
            While crawling, the crawler is comparing page to pin.
            If you are not sure, the auto-pin can be activate/deactivate afterwards.
        </p>
        <Typography.Title level={4}>Spider bot</Typography.Title>
        <p>
            <b>Spider bot</b> crawling method will get all the links inside the page of the given URL
            and crawl the children. It will then continue do the same with the children till no new
            link is found. Be careful if you have big website, this is most likely not the right
            solution for you.
        </p>
        <Typography.Title level={4}>URLs list</Typography.Title>
        <p>
            <b>URLs list</b> crawling method will crawl a specific sets of URLs. In the URL input field
            you must provide an endpoint containing a list of URLs (a simple text format, with one URL
            per line). The crawler will crawl each of those URL only and will not try to find links in
            the page. To use a static list of URLs, you can use a tool
            like <a href="https://pastebin.com" target="_blank" rel="noopener noreferrer">https://pastebin.com</a>.
        </p>
    </>
);

