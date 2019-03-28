import React from 'react';
import Icon from 'antd/lib/icon';
import message from 'antd/lib/message';
import notification from 'antd/lib/notification';
import { graphql } from 'react-apollo';

import PIN from './gql/mutation/pin';
import GET_PAGES from './gql/query/getPages';

export class PagesActionPin extends React.Component {
    onPin = async () => {
        const { mutate, timestamp, id } = this.props;
        try {
            await mutate({
                variables: { timestamp: timestamp.toString(), id },
                update: (store, { data: { pin } }) => {
                    const query = GET_PAGES;
                    const variables = {
                        timestamp: timestamp.toString(),
                    };
                    const { getPages } = store.readQuery({ query, variables });
                    const index = getPages.findIndex(page => page.id === pin.id);
                    getPages[index] = pin;
                    store.writeQuery({
                        query, variables, data: {
                            getPages,
                        }
                    });
                    // would need to update pins as well
                    // implement lib for insert, update, upsert...
                },
            });
            message.success('Page pinned as reference for comparison.', 2);
        } catch (error) {
            notification['error']({
                message: 'Something went wrong!',
                description: error.toString(),
            });
        }
    }

    render() {
        return (
            <Icon
                type="pushpin"
                title="pin as reference for comparison"
                onClick={this.onPin}
            />
        );
    }
}

export default graphql(PIN)(PagesActionPin);
