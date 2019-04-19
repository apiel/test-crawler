import React, { useState, useEffect } from 'react';
import Input from 'antd/lib/input';
// import Select from 'antd/lib/select';
import Form from 'antd/lib/form';
import Icon from 'antd/lib/icon';
import Radio from 'antd/lib/radio';
import Typography from 'antd/lib/typography';
import notification from 'antd/lib/notification';
import Button from 'antd/lib/button';
import { parse } from 'query-string';
import { Preset as PresetType, CrawlerInput } from 'test-crawler-lib';

import { getHistoryRoute } from './routes';
import { saveAndStart, getCrawlers } from './server/crawler';
import { useIsomor } from 'isomor-react';
import { Info } from './Info';
import { Preset } from './Preset';
// import { CrawlerMethod } from 'test-crawler-lib';

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

const usePreset = (search: string) => {
    const initialPreset: PresetType = {
        name: '',
        id: '',
        crawlerInput: {
            method: 'spiderbot', // CrawlerMethod.SPIDER_BOT,
            url: 'http://localhost:3003/',
            viewport: { width: 800, height: 600 },
        }
    };
    const [preset, setPreset] = useState<PresetType>(initialPreset);

    useEffect(() => {
        if (search) {
            const crawlerInput = parse(search) as any as CrawlerInput;
            setPreset({ ...initialPreset, crawlerInput });
        }
    }, [search]);

    return { preset, setPreset };
}

const New = ({ history, location: { search }, form: { getFieldDecorator, validateFields } }: any) => {
    const { call } = useIsomor();
    const start = async ({ saveAs, ...input }: any) => {
        try {
            const response = await saveAndStart({ ...input, viewport: { width: 800, height: 600 } }, saveAs);
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

    const { preset, setPreset } = usePreset(search);

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Item style={toolbarStyle}>
                <Preset setPreset={setPreset} setDefault={!search} />
            </Form.Item>
            <Form.Item>
                {getFieldDecorator('url', {
                    rules: [{ required: true, message: 'Please input an URL to crawl!' }],
                    initialValue: preset.crawlerInput.url,
                })(
                    <Input addonBefore="URL" />
                )}
            </Form.Item>
            <Form.Item>
                {getFieldDecorator('method', {
                    initialValue: preset.crawlerInput.method,
                })(
                    <Radio.Group size="small">
                        <Radio.Button value={'spiderbot'}><Icon type="radar-chart" /> Spider bot</Radio.Button>
                        <Radio.Button value={'urls'}><Icon type="ordered-list" /> URLs list</Radio.Button>
                    </Radio.Group>
                )}
                <Info>
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
                </Info>
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
