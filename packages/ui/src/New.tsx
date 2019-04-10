import React from 'react';
import Input from 'antd/lib/input';
// import Select from 'antd/lib/select';
import Form from 'antd/lib/form';
import notification from 'antd/lib/notification';

import Btn from 'antd/lib/button';
const Button = Btn as any;

import { getHistoryRoute } from './routes';

const buttonStyle = {
    marginTop: 10,
}

export class New extends React.Component<any> {
    start = async (input: any) => {
        // assign(input, { viewport: { width: 800, height: 600 } }); // till field is implemented
        // const { mutate, history } = this.props;
        // try {
        //     // should we show loading and deactivate btn --> this.props.form.isSubmitting()
        //     const { data: { startCrawler: { crawler: { timestamp } } } } = await mutate({
        //         variables: { input: { ...input, viewport: {} } },
        //         update: (store, { data: { startCrawler: { crawler, config: { MAX_HISTORY } } } }) => {
        //             const query = GET_CRAWLERS;
        //             const { getCrawlers } = store.readQuery({ query });
        //             store.writeQuery({
        //                 query, data: {
        //                     getCrawlers: [crawler, ...getCrawlers].slice(0, MAX_HISTORY),
        //                 }
        //             });
        //         },
        //     });
        //     history.push(getHistoryRoute(timestamp));
        // } catch (error) {
        //     notification['error']({
        //         message: 'Something went wrong!',
        //         description: error.toString(),
        //     });
        // }
    }

    handleSubmit = (e: any) => {
        e.preventDefault();
        this.props.form.validateFields((err: any, values: any) => {
            if (!err) {
                this.start(values);
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        // console.log('this.props.form', this.props.form);
        // console.log('this.props', this.props);
        return (
            <Form onSubmit={this.handleSubmit}>
                <Form.Item>
                    {getFieldDecorator('url', {
                        rules: [{ required: true, message: 'Please input an URL to crawl!' }],
                        initialValue: 'http://localhost:3005/',
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
}

const yo = Form.create({ name: 'start_crawler' })(New);
export default yo;
