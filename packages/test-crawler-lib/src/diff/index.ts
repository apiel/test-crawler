import { info } from 'npmlog';
import { getFilePath, FilePath } from '../../lib/utils';
import { BASE_FOLDER } from '../../lib/config';
import { PNG } from 'pngjs';
import { pixdiff, Zone, groupOverlappingZone } from 'pixdiff-zone';

import { readJson, readFile, pathExists, writeFile, writeJSON } from 'fs-extra';
import { PageData, Crawler } from '../../lib/typing';

async function parsePng(data: PageData, filePath: FilePath, basePath: FilePath) {
    const file = filePath('png');
    const { id, url } = data;
    const actual = await readFile(file);
    const expected = await readFile(basePath('png'));
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
        // zones: zones.map(zone => ({ zone, status: 'diff' })),
        zones: await parseZones(basePath, zones),
    };
    await writeJSON(filePath('json'), data, { spaces: 4 });

    return zones.length;
}

async function parseZones(basePath: FilePath, zones: Zone[]) {
    const base: PageData = await readJson(basePath('json'));
    const baseZones = base.png.diff.zones.map(z => z.zone);
    return zones.map(zone => ({
        zone,
        status: groupOverlappingZone([...baseZones, zone]).length === baseZones.length ? 'valid' : 'diff',
    }));
}

export async function prepare(id: string, distFolder: string) {
    const basePath = getFilePath(id, BASE_FOLDER);
    const filePath = getFilePath(id, distFolder);
    const data = await readJson(filePath('json'));

    let diffZoneCount = 0;
    if (await pathExists(basePath('png'))) {
        diffZoneCount = await parsePng(data, filePath, basePath);
    } else {
        info('DIFF', 'new png');
    }
    return {
        diffZoneCount,
    };
}
