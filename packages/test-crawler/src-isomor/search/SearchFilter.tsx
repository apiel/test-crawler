import React from 'react';
import Select from 'antd/lib/select';
import { PageData } from '../server/typing';

import { searchStyle, onFilter } from './search';

const { Option } = Select;

export interface Filters {
    [key: string]: string;
}

interface Props {
    filters: Filters;
    children: (pagesFiltered: PageData[] | undefined) => React.ReactNode;
    pages: PageData[];
}
export const SearchFilter = ({ children, pages, filters }: Props) => {
    const [selectedFilters, setSelectedFilters] = React.useState<string[]>([]);
    const [pagesFiltered, setPagesFiltered] = React.useState<PageData[]>();
    React.useEffect(() => {
        onFilter(setPagesFiltered, pages, setSelectedFilters)(selectedFilters);
    }, [pages]);
    return (
        <>
            <Select
                mode="multiple"
                onChange={onFilter(setPagesFiltered, pages, setSelectedFilters)}
                tokenSeparators={[',']}
                style={searchStyle}
                placeholder="filters"
                filterOption={false}
                // onSearch={console.log}
                // mode="tags"
            >
                { Object.keys(filters).map(key => <Option key={key}>{filters[key]}</Option>) }
            </Select>
            {children(pagesFiltered)}
        </>
    );
}
