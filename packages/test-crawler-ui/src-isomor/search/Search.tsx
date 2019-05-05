import React from 'react';
import Input from 'antd/lib/input';
import { PageData } from 'test-crawler-lib';

import { onSearch, searchStyle } from './search';
import { SearchFilter, Filters } from './SearchFilter';

const { Search: SearchInput } = Input;

interface Props {
    withFilters?: Filters;
    response: PageData[],
    children: (pages: PageData[] | undefined) => React.ReactNode,
}
export const Search = ({ children, response, withFilters }: Props) => {
    const [pages, setPages] = React.useState<PageData[]>();
    React.useEffect(() => {
        setPages(response);
    }, [response]);

    return (
        <>
            <SearchInput
                placeholder="Search"
                onChange={onSearch(setPages, response)}
                style={searchStyle}
                allowClear
            />
            {withFilters
                ? <SearchFilter children={children} pages={pages!} filters={withFilters} />
                : children(pages)
            }
        </>
    );
}
