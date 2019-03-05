import { info } from 'npmlog';
import { getFolders } from '../utils';
import { readdirSync, readFileSync, existsSync } from 'fs';
import { PAGES_FOLDER } from '../config';
import { diffChars, createTwoFilesPatch } from 'diff';

import { extname } from 'path';

export async function parse() {
    info('Parse result', 'start');

    let matchCount = 0;
    let htmlCount = 0;
    const [last, previous] = getFolders().reverse();

    const files = readdirSync(`${PAGES_FOLDER}/${last}`);
    files.forEach((file) => {
        const lastFile = `${PAGES_FOLDER}/${last}/${file}`;
        const previousFile = `${PAGES_FOLDER}/${previous}/${file}`;
        const extension = extname(lastFile);
        // if .error
        if (extension === '.html') {
            htmlCount++;
            if (existsSync(previousFile)) {
                const actual = readFileSync(`${PAGES_FOLDER}/${last}/${file}`).toString();
                const expected = readFileSync(`${PAGES_FOLDER}/${previous}/${file}`).toString();
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
    });
    info('Html matching', `${matchCount} of ${htmlCount}`);
}
