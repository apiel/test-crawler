import React from 'react';
import Input from 'antd/lib/input';
import InputNumber from 'antd/lib/input-number';
import Checkbox from 'antd/lib/checkbox';
import Form, { FormComponentProps } from 'antd/lib/form';
import Icon from 'antd/lib/icon';
import Radio from 'antd/lib/radio';
import Typography from 'antd/lib/typography';
import notification from 'antd/lib/notification';
import Button from 'antd/lib/button';
import { RouteComponentProps } from 'react-router';

import { getResultsRoute } from '../routes';
import { saveAndStart, getCrawlers } from '../server/crawler';
import { useAsyncCache, Call } from 'react-async-cache';
import { Info } from '../common/Info';
import { Preset } from './Preset';
import { Viewport } from './Viewport';
import { usePreset } from './usePreset';
import { History } from 'history';
import { CrawlerInput } from 'test-crawler-lib';

const { Paragraph, Text } = Typography;

const inlineStyle = {
    marginRight: 10,
    display: 'inline-block',
}

const toolbarStyle = {
    backgroundColor: '#EEE',
    padding: '0px 10px',
    borderRadius: 5,
    marginBottom: 12,
}

const radioGroupdStyle = {
    marginRight: 30,
}

const start = async (
    history: History<any>,
    { saveAs, viewport, ...input }: (CrawlerInput & { saveAs: string, viewport: string }),
    call: Call,
) => {
    try {
        const response = await saveAndStart({ ...input, viewport: JSON.parse(viewport) }, saveAs);
        await call(getCrawlers);
        history.push(getResultsRoute(response.crawler.timestamp.toString()));
    } catch (error) {
        notification['error']({
            message: 'Something went wrong!',
            description: error.toString(),
        });
    }
}

const handleSubmit = (history: History<any>, validateFields: any, call: Call) => (event: React.FormEvent<any>) => {
    event.preventDefault();
    validateFields((err: any, values: any) => {
        if (!err) {
            start(history, values, call);
        }
    });
}

type Props = FormComponentProps & RouteComponentProps;
const New = ({ history, location: { search }, form: { getFieldDecorator, validateFields, getFieldValue } }: Props) => {
    const { preset, setPreset } = usePreset(search);
    const { call } = useAsyncCache();

    return (
        <Form onSubmit={handleSubmit(history, validateFields, call)}>
            <Form.Item style={toolbarStyle}>
                <Preset setPreset={setPreset} setDefault={!search} />
            </Form.Item>
            <Form.Item>
                {getFieldDecorator('url', {
                    rules: [{ required: true, message: 'Please input an URL to crawl!' }],
                    initialValue: preset.crawlerInput.url,
                })(
                    <Input addonBefore="URL" addonAfter={
                        <Viewport
                            getFieldDecorator={getFieldDecorator}
                            initialValue={JSON.stringify(preset.crawlerInput.viewport)}
                        />
                    } />
                )}
            </Form.Item>
            <Form.Item>
                <Form.Item style={inlineStyle}>
                    {getFieldDecorator('method', {
                        initialValue: preset.crawlerInput.method,
                    })(
                        <Radio.Group size="small" style={radioGroupdStyle}>
                            <Radio.Button value={'spiderbot'}><Icon type="radar-chart" /> Spider bot</Radio.Button>
                            <Radio.Button value={'urls'}><Icon type="ordered-list" /> URLs list</Radio.Button>
                        </Radio.Group>
                    )}
                </Form.Item>
                {getFieldValue('method') === 'spiderbot' && <Form.Item style={inlineStyle}>
                    Limit {getFieldDecorator('limit', {
                        initialValue: 0, // preset.crawlerInput.method,
                    })(
                        <InputNumber min={0} size="small" />
                    )}
                </Form.Item>}
                <Info>
                    <Paragraph ellipsis={{ rows: 1, expandable: true }}>
                        <b>Spider bot</b> crawling method will get all the links inside the page of the given URL
                        and crawl the children. It will then continue do the same with the children till no new
                        link is found. Be careful if you have big website, this is most likely not the right
                        solution for you.
                    </Paragraph>
                    <Paragraph ellipsis={{ rows: 1, expandable: true }}>
                        <b>URLs list</b> crawling method will crawl a specific sets of URLs. In the URL input field
                        you must provide an endpoint containing a list of URLs (a simple text format, with one URL
                        per line). The crawler will crawl each of those URL only and will not try to find links in
                        the page.
                    </Paragraph>
                </Info>
            </Form.Item>
            <Form.Item>
                {getFieldDecorator('autopin', {
                    valuePropName: 'checked',
                    initialValue: preset.crawlerInput.autopin,
                })(
                    <Checkbox>Automatically pin new page founds.</Checkbox>
                )}
            </Form.Item>
            <Form.Item>
                <Form.Item style={inlineStyle}>
                    <Button
                        type="primary"
                        icon="caret-right"
                        htmlType="submit"
                    >
                        Start
                    </Button>
                </Form.Item>
                <Form.Item style={inlineStyle}>
                    {getFieldDecorator('saveAs', {
                        initialValue: preset.name,
                    })(
                        <Input addonBefore="Save as" placeholder="Leave empty to don't save" />
                    )}
                </Form.Item>
                <Info>
                    <Paragraph>
                        If you save as <Text code>Default</Text>, this preset will always be load per default.
                    </Paragraph>
                </Info>
            </Form.Item>
        </Form>
    );
}

const NewForm = Form.create({ name: 'start_crawler' })(New);
export default NewForm;
