import React, { ReactChildren } from 'react';
import Input from 'antd/lib/input';
import Select from 'antd/lib/select';
import { PageData } from 'test-crawler-lib';

import { onSearch, searchStyle, onFilter } from './search';

const { Search } = Input;
const { Option } = Select;

export const usePagesSearch = (response: PageData[]) => {
    const [pages, setPages] = React.useState<PageData[]>();
    React.useEffect(() => {
        setPages(response);
    }, [response]);

    const [filters, setFilters] = React.useState<string[]>([]);
    const [pagesFiltered, setPagesFiltered] = React.useState<PageData[]>();
    React.useEffect(() => {
        onFilter(setPagesFiltered, pages, setFilters)(filters);
    }, [pages]);

    return { pages, setPages, setFilters, pagesFiltered, setPagesFiltered };
}

interface Props {
    response: PageData[],
    children: any,
}
export const PagesSearch = ({ children, response }: Props) => {
    const { pages, setPages, setFilters, pagesFiltered, setPagesFiltered } = usePagesSearch(response);
    return (
        <>
            <Search
                placeholder="Search"
                onChange={onSearch(setPages, response)}
                style={searchStyle}
                allowClear
            />
            <Select
                mode="tags"
                onChange={onFilter(setPagesFiltered, pages, setFilters)}
                tokenSeparators={[',']}
                style={searchStyle}
                placeholder="filters"
            >
                <Option key="with-diff">with diff</Option>
            </Select>
            {children(pagesFiltered)}
        </>
    );
}
