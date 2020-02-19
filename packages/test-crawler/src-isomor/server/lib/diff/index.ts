import { info } from 'logol';
import { PIN_FOLDER, PROJECT_FOLDER } from '../config';
import { PNG } from 'pngjs';
import { pixdiff, Zone, groupOverlappingZone } from 'pixdiff-zone';

import { readJson, readFile, pathExists, writeFile, writeJSON } from 'fs-extra';
import { PageData, Crawler, ZoneStatus } from '../../typing';
import { CrawlerProvider } from '../index';
import { join } from 'path';
import { StorageType } from '../../storage.typing';

async function parsePng(
    data: PageData,
    pngFile: string,
    jsonFile: string,
    pinPngFile: string,
    pinJsonFile: string,
) {
    const { id, url } = data;
    const actual = await readFile(pngFile);
    const expected = await readFile(pinPngFile);
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

    if (pixelDiffRatio) { // what is this?
        const buffer = PNG.sync.write(diffImage, { colorType: 6 });
        const diffFile = `${pngFile}.diff.png`;
        await writeFile(diffFile, buffer);
        info('PNG', id, url, 'diff file:', diffFile);
    }

    data.png.diff = {
        pixelDiffRatio,
        // zones: zones.map(zone => ({ zone, status: 'diff' })),
        zones: await parseZones(pinJsonFile, zones),
    };
    await writeJSON(jsonFile, data, { spaces: 4 });

    return zones.length;
}

function cropPng(png: PNG, width: number, height: number) {
    const origin = new PNG({ width: png.width, height: png.height });
    origin.data = png.data;

    const cropped = new PNG({ width, height });
    origin.bitblt(cropped, 0, 0, width, height);

    return cropped;
}

async function parseZones(pinJsonFile: string, zones: Zone[]) {
    const base: PageData = await readJson(pinJsonFile);
    const baseZones = base.png.diff.zones.map(z => z.zone);
    return zones.map(zone => ({
        zone,
        status: groupOverlappingZone([...baseZones, zone]).length === baseZones.length
            ? ZoneStatus.valid
            : ZoneStatus.diff,
    }));
}

export async function prepare(projectId: string, id: string, distFolder: string, crawler: Crawler) {
    const pngFile = join(distFolder, `${id}.png`);
    const jsonFile = join(distFolder, `${id}.json`);
    const pinPngFile = join(PROJECT_FOLDER, projectId, PIN_FOLDER, `${id}.png`);
    const pinJsonFile = join(PROJECT_FOLDER, projectId, PIN_FOLDER, `${id}.json`);

    const data = await readJson(jsonFile);

    let diffZoneCount = 0;
    if (await pathExists(pinJsonFile)) {
        if (await pathExists(pinPngFile)) {
            diffZoneCount = await parsePng(data, pngFile, jsonFile, pinPngFile, pinJsonFile);
        } else {
            info('DIFF', 'new png');
        }
    } else if (crawler.autopin) {
        const crawlerProvider = new CrawlerProvider(StorageType.Local);
        crawlerProvider.copyToPins(projectId, crawler.timestamp, id);
        // we might want to put a flag to the page saying that it was automatically pin
    }
    return {
        diffZoneCount,
    };
}
