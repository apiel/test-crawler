import React from 'react';
import { PageData } from 'test-crawler-core';

import { onSearch, searchStyle, onFilter } from './search';
import Select from 'antd/lib/select';

const { Option } = Select;

export interface Filters {
    [key: string]: string;
}

interface Props {
    withFilters?: Filters;
    response: PageData[],
    children: (pages: PageData[] | undefined) => React.ReactNode,
}
export const Search = ({ children, response, withFilters }: Props) => {
    const [pages, setPages] = React.useState<PageData[]>();
    const [selectedFilters, setSelectedFilters] = React.useState<string[]>([]);
    const [pagesFiltered, setPagesFiltered] = React.useState<PageData[]>();
    React.useEffect(() => {
        setPages(response);
        onFilter(setPagesFiltered, response, setSelectedFilters)(selectedFilters);
    }, [response, setSelectedFilters, selectedFilters]);

    return (
        <>
            <Select
                mode="tags"
                onChange={onFilter(setPagesFiltered, pages, setSelectedFilters)}
                tokenSeparators={[',']}
                style={searchStyle}
                placeholder="Search"
                filterOption={false}
                onSearch={onSearch(setPagesFiltered, pages, selectedFilters)}
            >
                { !!withFilters && Object.keys(withFilters).map(key => <Option key={key}>{withFilters[key]}</Option>) }
            </Select>
            {children(pagesFiltered)}
        </>
    );
}
