import React from 'react';
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';
import Form from 'antd/lib/form';
import notification from 'antd/lib/notification';
import { graphql } from 'react-apollo';

import START_CRAWLER from './gql/mutation/startCrawler';
import GET_CRAWLERS from './gql/query/getCrawlers';
import { getHistoryRoute } from './routes';

const buttonStyle = {
    marginTop: 10,
}

export class New extends React.Component {
    start = async (input) => {
        const { mutate, history } = this.props;
        try {
            // should we show loading and deactivate btn --> this.props.form.isSubmitting()
            const { data: { startCrawler: { crawler: { timestamp } } } } = await mutate({
                variables: { input },
                update: (store, { data: { startCrawler: { crawler, config: { MAX_HISTORY } } } }) => {
                    const query = GET_CRAWLERS;
                    const { getCrawlers } = store.readQuery({ query });
                    store.writeQuery({
                        query, data: {
                            getCrawlers: [crawler, ...getCrawlers].slice(0, MAX_HISTORY),
                        }
                    });
                },
            });
            history.push(getHistoryRoute(timestamp));
        } catch (error) {
            notification['error']({
                message: 'Something went wrong!',
                description: error.toString(),
            });
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.start(values);
            }
        });
    }

    render() {
        const { getFieldDecorator, isSubmitting } = this.props.form;
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
                <Button
                    type="primary"
                    icon="caret-right"
                    style={buttonStyle}
                    htmlType="submit"
                    loading={isSubmitting()}
                >
                    Start
                </Button>
            </Form>
        );
    }
}


export default graphql(START_CRAWLER)(Form.create({ name: 'start_crawler' })(New));
