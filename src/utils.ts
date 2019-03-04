import { readdirSync } from 'fs';
import { PAGES_FOLDER } from './config';

export function getFolders() {
    const folders = readdirSync(PAGES_FOLDER);
    folders.sort();

    return folders;
}
