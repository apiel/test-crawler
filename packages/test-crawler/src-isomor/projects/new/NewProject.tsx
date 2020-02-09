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
import { CrawlerInput } from '../../server/typing';

import { getHomeRoute } from '../../routes';
import { saveProject } from '../../server/service';
import { Info } from '../../common/Info';
import { Viewport } from './Viewport';
import { getDefaultViewport } from '../../viewport';
import { History } from 'history';

const inlineStyle = {
    marginRight: 10,
    display: 'inline-block',
}

const radioGroupdStyle = {
    marginRight: 30,
}

const save = async (
    history: History<any>,
    { name, viewport, ...input }: (CrawlerInput & { name: string, viewport: string }),
) => {
    try {
        await saveProject('ToDo' as any, { ...input, viewport: JSON.parse(viewport) }, name, undefined);
        history.push(getHomeRoute());
    } catch (error) {
        notification['error']({
            message: 'Something went wrong!',
            description: error.toString(),
        });
    }
}

const handleSubmit = (history: History<any>, validateFields: any) => (event: React.FormEvent<any>) => {
    event.preventDefault();
    validateFields((err: any, values: any) => {
        if (!err) {
            save(history, values);
        }
    });
}

type Props = FormComponentProps & RouteComponentProps;
const NewProject = ({ history, form: { getFieldDecorator, validateFields, getFieldValue } }: Props) => {
    return (
        <Form onSubmit={handleSubmit(history, validateFields)}>
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
                        addonAfter={
                            <Viewport
                                getFieldDecorator={getFieldDecorator}
                                initialValue={JSON.stringify(getDefaultViewport())}
                            />
                        }
                    />
                )}
            </Form.Item>
            <Form.Item>
                <Form.Item style={inlineStyle}>
                    {getFieldDecorator('method', {
                        initialValue: 'spiderbot',
                    })(
                        <Radio.Group size="small" style={radioGroupdStyle}>
                            <Radio.Button value={'spiderbot'}><Icon type="radar-chart" /> Spider bot</Radio.Button>
                            <Radio.Button value={'urls'}><Icon type="ordered-list" /> URLs list</Radio.Button>
                        </Radio.Group>
                    )}
                </Form.Item>
                {getFieldValue('method') === 'spiderbot' && <Form.Item style={inlineStyle}>
                    Limit {getFieldDecorator('limit')(
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
                </Form.Item>}
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
            </Form.Item>
            <Form.Item>
                {getFieldDecorator('autopin', {
                    valuePropName: 'checked',
                })(
                    <Checkbox>Automatically pin new page founds.</Checkbox>
                )}
            </Form.Item>
            <Form.Item>
                <Form.Item style={inlineStyle}>
                    <Button
                        type="primary"
                        icon="plus"
                        htmlType="submit"
                    >
                        Create
                    </Button>
                </Form.Item>
            </Form.Item>
        </Form>
    );
}

const NewForm = Form.create({ name: 'start_crawler' })(NewProject);
export default NewForm;
