import GET_PAGES from '../gql/query/getPages';

export const updatePagesCache = (store, page, timestamp) => {
    const query = GET_PAGES;
    const variables = {
        timestamp: timestamp.toString(),
    };
    const { getPages } = store.readQuery({ query, variables });
    const index = getPages.findIndex(_page => _page.id === page.id);
    getPages[index] = page;
    store.writeQuery({
        query, variables, data: {
            getPages,
        }
    });
    // should we update pins as well?
    // implement lib for insert, update, upsert...
}