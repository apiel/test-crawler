import { info } from 'npmlog';
import { getFilePath } from '../utils';
import {  BASE_FOLDER } from '../config';
import { PNG } from 'pngjs';
import { pixdiff } from 'pixdiff';

import { readJson, readFile, pathExists, writeFile } from 'fs-extra';
import { PageData } from '../typing';

const pngDiff = [];

function loadJson(file: string): Promise<PageData> {
    const jsonFile = `${file.split('.').slice(0, -1).join('.')}.json`;
    return readJson(jsonFile);
}

async function parsePng({ id, url }: PageData, file: string, baseFile: string) {
    const actual = await readFile(file);
    const expected = await readFile(baseFile);
    const rawActual = PNG.sync.read(actual);
    const rawExpected = PNG.sync.read(expected);

    const { width, height } = rawActual;
    const diffImage = new PNG({ width, height });

    const { diff, zones } = pixdiff(
        rawActual,
        rawExpected,
        diffImage,
    );

    const totalPixels = width * height;
    const diffRatio = diff / totalPixels;
    info('PNG', id, url, `diff ratio: ${diffRatio}`);
    info('PNG', 'zone', zones);

    if (diffRatio) {
        const buffer = PNG.sync.write(diffImage, { colorType: 6 });
        const diffFile = `${file}.diff.png`;
        writeFile(diffFile, buffer);
        info('PNG', id, url, 'diff file:', diffFile);
        pngDiff.push({ url, id, diffFile, diffRatio });
    }
}

export async function prepare(id: string, distFolder: string) {
    const basePath = getFilePath(id, BASE_FOLDER);
    const filePath = getFilePath(id, distFolder);
    const data = await loadJson(filePath('json'));
    if (await pathExists(basePath('png'))) {
        await parsePng(data, filePath('png'), basePath('png'));
    } else {
        info('DIFF', 'new png');
    }
}
