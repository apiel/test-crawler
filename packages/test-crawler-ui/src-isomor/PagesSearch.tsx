import React, { ReactChildren } from 'react';
import Input from 'antd/lib/input';
import { PageData } from 'test-crawler-lib';

import { onSearch, searchStyle } from './search';
import { PagesSearchFilter } from './PagesSearchFilter';

const { Search } = Input;

interface Props {
    response: PageData[],
    children: any,
}
export const PagesSearch = ({ children, response }: Props) => {
    const [pages, setPages] = React.useState<PageData[]>();
    React.useEffect(() => {
        setPages(response);
    }, [response]);

    return (
        <>
            <Search
                placeholder="Search"
                onChange={onSearch(setPages, response)}
                style={searchStyle}
                allowClear
            />
            <PagesSearchFilter children={children} pages={pages!} />
        </>
    );
}
