import React from 'react';
import Input from 'antd/lib/input';
// import Select from 'antd/lib/select';
import Form from 'antd/lib/form';
import notification from 'antd/lib/notification';

import Btn from 'antd/lib/button';
const Button = Btn as any;

import { getHistoryRoute } from './routes';
import { startCrawler, getCrawlers } from './server/crawler';
import { useIsomor } from 'isomor-react';

const buttonStyle = {
    marginTop: 10,
}

const New = ({ history, form: { getFieldDecorator, validateFields }}: any) => {
    const { call } = useIsomor();
    const start = async (input: any) => {
        try {
            // should we show loading and deactivate btn --> this.props.form.isSubmitting()
            // const { data: { startCrawler: { crawler: { timestamp } } } } = await mutate({
            //      variables: { input: { ...input, viewport: {} } },
            //     update: (store, { data: { startCrawler: { crawler, config: { MAX_HISTORY } } } }) => {
            //         const query = GET_CRAWLERS;
            //         const { getCrawlers } = store.readQuery({ query });
            //         store.writeQuery({
            //             query, data: {
            //                 getCrawlers: [crawler, ...getCrawlers].slice(0, MAX_HISTORY),
            //             }
            //         });
            //     },
            // });
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
