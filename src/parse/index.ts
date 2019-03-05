import { info } from 'npmlog';
import { getFolders } from '../utils';
import { PAGES_FOLDER } from '../config';
import { diffChars, createTwoFilesPatch } from 'diff';

import { extname } from 'path';
import { readJson, readFile, readdir, pathExists } from 'fs-extra';

export function loadJson(file: string): Promise<any> {
    const jsonFile = `${file.split('.').slice(0, -1).join('.')}.json`;
    return readJson(jsonFile);
}

export async function parse() {
    info('Parse result', 'start');

    let matchCount = 0;
    let htmlCount = 0;
    const [last, previous] = getFolders().reverse();

    const files = await readdir(`${PAGES_FOLDER}/${last}`);
    for (const file of files) {
        const lastFile = `${PAGES_FOLDER}/${last}/${file}`;
        const previousFile = `${PAGES_FOLDER}/${previous}/${file}`;
        const extension = extname(lastFile);
        // if .error
        if (extension === '.html') {
            htmlCount++;
            if (await pathExists(previousFile)) {
                const actual = await readFile(`${PAGES_FOLDER}/${last}/${file}`).toString();
                const expected = await readFile(`${PAGES_FOLDER}/${previous}/${file}`).toString();
                if (diffChars(actual, expected).length > 1) {
                    const result = createTwoFilesPatch('old', 'new', expected, actual);
                    info('Html diff', file, result);
                } else {
                    matchCount++;
                }
            } else {
                info('Html diff', file, 'new file');
            }
        }
    }
    info('Html matching', `${matchCount} of ${htmlCount}`);
}
