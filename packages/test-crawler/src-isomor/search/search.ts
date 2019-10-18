import { PageData } from '../server/typing';
import Fuse from 'fuse.js';
import get from 'lodash/get';
import { cardStyle, masonryOptions } from '../pages/pageStyle';

export const searchStyle = {
    width: cardStyle.width,
    marginRight: masonryOptions.gutter,
}

let timerSearch: NodeJS.Timer;
export const onSearch = (
    setPages: React.Dispatch<React.SetStateAction<PageData[] | undefined>>,
    pages: PageData[] | undefined,
    filters: string[],
) => (value: string) => {
    if (pages) {
        if (!value.length) {
            filterPages(setPages, pages, filters);
        } else {
            clearTimeout(timerSearch);
            timerSearch = setTimeout(() => {
                filterPages(setPages, searchPages(pages, value), filters);
            }, 500);
        }
    }
};

const searchPages = (
    pages: PageData[],
    value: string,
) => {
    const fuse = new Fuse(pages, {
        keys: [
            'url',
            'viewport.width',
            'viewport.height',
            'keywords',
        ],
    });
    return fuse.search(value);
}

// instead to have 2 fields, we could use one combine with to instance of fuse.js
// 1 with partial match and 1 with full word match for filters
// for the input field see "Search and Select Users" from select component
export const onFilter = (
    setPages: React.Dispatch<React.SetStateAction<PageData[] | undefined>>,
    pages: PageData[] | undefined,
    setFilters: React.Dispatch<React.SetStateAction<any>>,
) => (filters: string[]) => {
    if (pages) {
        setFilters(filters);
        filterPages(setPages, pages, filters);
    }
};

const filterPages = (
    setPages: React.Dispatch<React.SetStateAction<PageData[] | undefined>>,
    pages: PageData[] | undefined,
    filters: string[]
) => {
    if (pages) {
        if (!filters.length) {
            setPages(pages);
        } else {
            const searchValue = filters.filter(filter => !Object.keys(availableFilters).includes(filter)).join(' ');
            if (searchValue) {
                pages = searchPages(pages, searchValue);
            }
            setPages(pages.filter(page => {
                if (filters.includes('with-diff')) {
                    const pixelDiffRatio = get(page, 'png.diff.pixelDiffRatio');
                    return pixelDiffRatio > 0;
                }
                return true;
            }));
        }
    }
}

export const availableFilters = {
    'with-diff': 'with diff',
}
