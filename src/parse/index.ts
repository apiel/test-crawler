import { info } from 'npmlog';
import { getFolders } from '../utils';
import { readdirSync, readFileSync, existsSync } from 'fs';
import { PAGES_FOLDER } from '../config';
import * as diff from 'jest-diff';

import { extname } from 'path';

export async function parse() {
    info('Parse result', 'start');

    const [last, previous] = getFolders().reverse();

    const files = readdirSync(`${PAGES_FOLDER}/${last}`);
    files.forEach((file) => {
        const lastFile = `${PAGES_FOLDER}/${last}/${file}`;
        const previousFile = `${PAGES_FOLDER}/${previous}/${file}`;
        const extension = extname(lastFile);
        // if .error
        if (extension === '.html') {
            if (existsSync(previousFile)) {
                const actual = readFileSync(`${PAGES_FOLDER}/${last}/${file}`).toString();
                const expected = readFileSync(`${PAGES_FOLDER}/${previous}/${file}`).toString();
                // const diff = diffChars(lastHtml, previousHtml);
                // const diff = diffChars('abc', 'abc');
                const result = diff(expected, actual, {
                    aAnnotation: 'Previous',
                    bAnnotation: 'Actual',
                    // expand: snapshotState.expand,
                });
                info('Html diff', file, result);
            } else {
                info('Html diff', file, 'new file');
            }
        }
    });
}
