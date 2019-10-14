import { info } from 'logol';
import { getFilePath } from '../../dist-server/server/lib/utils';
import { BASE_FOLDER } from '../../dist-server/server/lib/config';
import { PNG } from 'pngjs';
import { pixdiff, Zone, groupOverlappingZone } from 'pixdiff-zone';

import { readJson, readFile, pathExists, writeFile, writeJSON } from 'fs-extra';
import { PageData, Crawler } from '../../src-isomor/server/typing';
import { FilePath } from '../../src-isomor/server/lib/utils';
import { CrawlerProvider } from '../../dist-server/server/lib';

async function parsePng(data: PageData, filePath: FilePath, basePath: FilePath) {
    const file = filePath('png');
    const { id, url } = data;
    const actual = await readFile(file);
    const expected = await readFile(basePath('png'));
    const rawActual = PNG.sync.read(actual);
    const rawExpected = PNG.sync.read(expected);

    let { width, height } = rawActual;
    width = Math.min(width, rawExpected.width); // even if width should be the same!!
    height = Math.min(height, rawExpected.height);

    const diffImage = new PNG({ width, height });
    const { diff, zones } = pixdiff(
        cropPng(rawActual, width, height),
        cropPng(rawExpected, width, height),
        diffImage,
    );

    const totalPixels = width * height;
    const pixelDiffRatio = diff / totalPixels;
    info('PNG', id, url, `diff ratio: ${pixelDiffRatio}`);
    info('PNG', 'zone', zones);

    if (pixelDiffRatio) {
        const buffer = PNG.sync.write(diffImage, { colorType: 6 });
        const diffFile = `${file}.diff.png`;
        await writeFile(diffFile, buffer);
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

function cropPng(png: PNG, width: number, height: number) {
    const origin = new PNG({ width: png.width, height: png.height });
    origin.data = png.data;

    const cropped = new PNG({ width, height });
    origin.bitblt(cropped, 0, 0, width, height);

    return cropped;
}

async function parseZones(basePath: FilePath, zones: Zone[]) {
    const base: PageData = await readJson(basePath('json'));
    const baseZones = base.png.diff.zones.map(z => z.zone);
    return zones.map(zone => ({
        zone,
        status: groupOverlappingZone([...baseZones, zone]).length === baseZones.length ? 'valid' : 'diff',
    }));
}

export async function prepare(id: string, distFolder: string, crawler: Crawler) {
    const basePath = getFilePath(id, BASE_FOLDER);
    const filePath = getFilePath(id, distFolder);
    const data = await readJson(filePath('json'));

    let diffZoneCount = 0;
    if (await pathExists(basePath('json'))) {
        if (await pathExists(basePath('png'))) {
            diffZoneCount = await parsePng(data, filePath, basePath);
        } else {
            info('DIFF', 'new png');
        }
    } else if (crawler.autopin) {
        const crawlerProvider = new CrawlerProvider();
        crawlerProvider.copyToBase(crawler.timestamp.toString(), id);
        // we might want to put a flag to the page saying that it was automatically pin
    }
    return {
        diffZoneCount,
    };
}
