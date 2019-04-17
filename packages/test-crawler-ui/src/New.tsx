import React from 'react';
import Input from 'antd/lib/input';
// import Select from 'antd/lib/select';
import Form from 'antd/lib/form';
import Icon from 'antd/lib/icon';
import Radio from 'antd/lib/radio';
import Typography from 'antd/lib/typography';
import notification from 'antd/lib/notification';

import Btn from 'antd/lib/button';
const Button = Btn as any;

import { getHistoryRoute } from './routes';
import { startCrawler, getCrawlers } from './server/crawler';
import { useIsomor } from 'isomor-react';

const { Paragraph } = Typography;

const buttonStyle = {
    marginTop: 10,
}

const infoStyle = {
    lineHeight: 1.2,
    borderLeft: '8px solid #EEE',
    paddingLeft: 15,
    color: '#666',
    textAlign: 'justify' as 'justify',
}

const New = ({ history, form: { getFieldDecorator, validateFields } }: any) => {
    const { call } = useIsomor();
    const start = async (input: any) => {
        try {
            const response = await startCrawler({ ...input, viewport: { width: 800, height: 600 } });
            await call(getCrawlers);
            history.push(getHistoryRoute(response.crawler.timestamp.toString()));
        } catch (error) {
            notification['error']({
                message: 'Something went wrong!',
                description: error.toString(),
            });
        }
    }
    const handleSubmit = (e: any) => {
        e.preventDefault();
        validateFields((err: any, values: any) => {
            if (!err) {
                start(values);
            }
        });
    }
    return (
        <Form onSubmit={handleSubmit}>
            <Form.Item>
                {getFieldDecorator('url', {
                    rules: [{ required: true, message: 'Please input an URL to crawl!' }],
                    initialValue: 'http://localhost:3003/',
                })(
                    <Input addonBefore="URL" />
                )}
            </Form.Item>
            <Form.Item>
                {getFieldDecorator('method', {
                    initialValue: 'spiderbot',
                })(
                    <Radio.Group size="small">
                        <Radio.Button value="spiderbot"><Icon type="radar-chart" /> Spider bot</Radio.Button>
                        <Radio.Button value="urls"><Icon type="ordered-list" /> URLs list</Radio.Button>
                    </Radio.Group>
                )}
                <div style={infoStyle}>
                    <Paragraph ellipsis={{ rows: 1, expandable: true }}>
                        <b>Spider bot</b> crawling method will get all the links inside the page of the given URL
                        and crawl the children. It will then continue do the same with the children till no new
                        link is found. Be careful if you have big website, this might is most likely not the right
                        solution for you.
                    </Paragraph>
                    <Paragraph ellipsis={{ rows: 1, expandable: true }}>
                        <b>URLs list</b> crawling method will crawl a specific sets of URLs. In the URL input field
                        you must provide an endpoint containing a list of URLs (a simple text format, with one URL
                        per line). The crawler will crawl each of those URL only and will not try to find links in
                        the page.
                    </Paragraph>
                </div>
            </Form.Item>
            {/* <Form.Item>
                {getFieldDecorator('viewport', {
                    initialValue: '800x600',
                })(
                    <Select addonBefore="Viewport">
                        <Select.Option value='800x600'>800x600</Select.Option>
                        <Select.Option value='320x480'>320x480 mobile</Select.Option>
                    </Select>
                )}
            </Form.Item> */}
            <Button
                type="primary"
                icon="caret-right"
                style={buttonStyle}
                htmlType="submit"
            >
                Start
            </Button>
        </Form>
    );
}

const NewForm = Form.create({ name: 'start_crawler' })(New);
export default NewForm;
