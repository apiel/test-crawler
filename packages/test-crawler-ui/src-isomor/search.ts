import { PageData } from 'test-crawler-lib';
import Fuse from 'fuse.js';
import get from 'lodash/get';
import { cardStyle, masonryOptions } from './pageStyle';

export const searchStyle = {
    width: cardStyle.width,
    marginRight: masonryOptions.gutter,
}

let timerSearch: NodeJS.Timer;
export const onSearch = (
    setSearchResult: React.Dispatch<React.SetStateAction<any>>,
    pages: PageData[],
) => ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    if (!value.length) {
        setSearchResult(pages);
    } else {
        const fuse = new Fuse(pages, {
            keys: [
                'url',
                'viewport.width',
                'viewport.height',
                'keywords',
            ],
        });
        clearTimeout(timerSearch);
        timerSearch = setTimeout(() => {
            setSearchResult(fuse.search(value));
        }, 500);
    }
};

export const onFilter = (
    setFilterResult: React.Dispatch<React.SetStateAction<any>>,
    pages: PageData[] | undefined,
    setFilters: React.Dispatch<React.SetStateAction<any>>,
) => (filters: string[]) => {
    if (pages) {
        setFilters(filters);
        if (!filters.length) {
            setFilterResult(pages);
        } else {
            setFilterResult(pages.filter(page => {
                if (filters.includes('with-diff')) {
                    const pixelDiffRatio = get(page, 'png.diff.pixelDiffRatio');
                    return pixelDiffRatio > 0;
                }
                return false;
            }));
        }
    }
};
