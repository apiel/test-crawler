import { PageData } from 'test-crawler-lib';
import Fuse from 'fuse.js';
import { cardWidth } from './pageStyle';

export const searchStyle = {
    width: cardWidth,
}

let timerSearch: NodeJS.Timer;
export const onSearch = (
    setSearchResult: React.Dispatch<React.SetStateAction<any>>,
    pages: PageData[] | PageDataForSearch[],
) => ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    if (!value.length) {
        setSearchResult(pages);
    } else {
        console.log('pages', pages);
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

export interface PageDataForSearch extends PageData {
    keywords: string[],
};

export const preparePageData = (pages: PageData[]): PageDataForSearch[] => {
    return pages.map(page => {
        const keywords: string[] = [];
        if (page && page.png && page.png.diff) {
            const { diff } = page.png;
            if (diff.pixelDiffRatio > 0) {
                keywords.push('with:diff');
            }
        }
        return { ...page, keywords };
    });
}
