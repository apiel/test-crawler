import { readdirSync } from 'fs';
import { join } from 'path';
import { CRAWL_FOLDER } from '../lib/config';

// to delete

export function getFolders() {
    const folders = readdirSync(CRAWL_FOLDER);
    folders.sort();

    return folders;
}

export type FilePath = (extension: string) => string;
export const getFilePath = (id: string, distFolder: string): FilePath => (extension: string) => {
    return join(distFolder, `${id}.${extension}`);
};
