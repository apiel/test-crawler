import { info } from 'npmlog';
import { getFilePath, FilePath } from '../../lib/utils';
import { BASE_FOLDER } from '../../lib/config';
import { PNG } from 'pngjs';
import { pixdiff } from 'pixdiff';

import { readJson, readFile, pathExists, writeFile, writeJSON } from 'fs-extra';
import { PageData } from '../../lib/typing';

async function parsePng(data: PageData, filePath: FilePath, baseFile: string) {
    const file = filePath('png');
    const { id, url } = data;
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
    const pixelDiffRatio = diff / totalPixels;
    info('PNG', id, url, `diff ratio: ${pixelDiffRatio}`);
    info('PNG', 'zone', zones);

    if (pixelDiffRatio) {
        const buffer = PNG.sync.write(diffImage, { colorType: 6 });
        const diffFile = `${file}.diff.png`;
        writeFile(diffFile, buffer);
        info('PNG', id, url, 'diff file:', diffFile);
    }

    data.png.diff = {
        pixelDiffRatio,
        zones: zones.map(zone => ({ zone, status: 'diff' })),
    };
    await writeJSON(filePath('json'), data);

    return zones.length;
}

export async function prepare(id: string, distFolder: string) {
    const basePath = getFilePath(id, BASE_FOLDER);
    const filePath = getFilePath(id, distFolder);
    const data = await readJson(filePath('json'));

    let diffZoneCount = 0;
    if (await pathExists(basePath('png'))) {
        diffZoneCount = await parsePng(data, filePath, basePath('png'));
    } else {
        info('DIFF', 'new png');
    }
    return {
        diffZoneCount,
    };
}
