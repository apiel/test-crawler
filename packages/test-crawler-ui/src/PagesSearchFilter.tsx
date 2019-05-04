import React from 'react';
import Select from 'antd/lib/select';
import { PageData } from 'test-crawler-lib';

import { searchStyle, onFilter } from './search';

const { Option } = Select;

interface Props {
    children: any,
    pages: PageData[],
}
export const PagesSearchFilter = ({ children, pages }: Props) => {
    const [filters, setFilters] = React.useState<string[]>([]);
    const [pagesFiltered, setPagesFiltered] = React.useState<PageData[]>();
    React.useEffect(() => {
        onFilter(setPagesFiltered, pages, setFilters)(filters);
    }, [pages]);
    return (
        <>
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
