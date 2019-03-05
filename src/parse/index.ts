import { info } from 'npmlog';
import { getFolders } from '../utils';
import { PAGES_FOLDER } from '../config';
import { diffChars, createTwoFilesPatch } from 'diff';

import { extname } from 'path';
import { readJson, readFile, readdir, pathExists } from 'fs-extra';
import { PageData } from '../typing';

let matchCount = 0;
let htmlCount = 0;
let newCount = 0;
let errorCount = 0;

function loadJson(file: string): Promise<PageData> {
    const jsonFile = `${file.split('.').slice(0, -1).join('.')}.json`;
    return readJson(jsonFile);
}

async function parseHtml({id, url}: PageData, lastFile: string, previousFile: string) {
    htmlCount++;
    if (await pathExists(previousFile)) {
        const actual = (await readFile(lastFile)).toString();
        const expected = (await readFile(previousFile)).toString();
        if (diffChars(actual, expected).length > 1) {
            const result = createTwoFilesPatch('old', 'new', expected, actual);
            info('Html diff', url, id, result);
        } else {
            matchCount++;
        }
    } else {
        info('Html diff', url, id, 'new file');
        newCount++;
    }
}

async function parseError({id, url}: PageData) {
    // info('Got some error', url, id);
    errorCount++;
    // could check for previous file
}

export async function parse() {
    info('Parse result', 'start');
    const [last, previous] = getFolders().reverse();

    const files = await readdir(`${PAGES_FOLDER}/${last}`);
    for (const file of files) {
        const lastFile = `${PAGES_FOLDER}/${last}/${file}`;
        const extension = extname(lastFile);
        const data = await loadJson(lastFile);

        if (extension === '.error') {
            await parseError(data);
        } else if (extension === '.html') {
            const previousFile = `${PAGES_FOLDER}/${previous}/${file}`;
            await parseHtml(data, lastFile, previousFile);
        }
    }
    info('Html matching', `${matchCount} of ${htmlCount}, ${newCount} new files.`);
    info('Error count', `${errorCount}`);
}
