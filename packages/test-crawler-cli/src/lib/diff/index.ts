import { info } from 'logol';
import { PNG } from 'pngjs';
import { pixdiff, Zone, groupOverlappingZone } from 'pixdiff-zone';

import {
    readJson,
    readFile,
    pathExists,
    writeFile,
    writeJSON,
    copy,
} from 'fs-extra';
import { PageData, Crawler, ZoneStatus } from '../typing';
import { pathImageFile, pathInfoFile, pathPinInfoFile } from '../path';

async function parsePng(
    data: PageData,
    pngFile: string,
    jsonFile: string,
    pinPngFile: string,
    pinInfo: PageData,
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

    if (pixelDiffRatio) {
        // what is this?
        const buffer = PNG.sync.write(diffImage, { colorType: 6 });
        const diffFile = `${pngFile}.diff.png`;
        await writeFile(diffFile, buffer);
        info('PNG', id, url, 'diff file:', diffFile);
    }

    data.png.diff = {
        pixelDiffRatio,
        // zones: zones.map(zone => ({ zone, status: 'diff' })),
        zones: await parseZones(pinInfo, zones),
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

async function parseZones(pinInfo: PageData, zones: Zone[]) {
    const baseZones = pinInfo.png.diff.zones.map(z => z.zone);
    return zones.map(zone => ({
        zone,
        status:
            groupOverlappingZone([...baseZones, zone]).length ===
            baseZones.length
                ? ZoneStatus.valid
                : ZoneStatus.diff,
    }));
}

export async function prepare(
    projectId: string,
    timestamp: string,
    id: string,
    crawler: Crawler,
) {
    const jsonFile = pathInfoFile(projectId, timestamp, id);
    const pinJsonFile = pathPinInfoFile(projectId, id);

    const data = await readJson(jsonFile);

    let diffZoneCount = 0;
    if (await pathExists(pinJsonFile)) {
        const pinInfo: PageData = await readJson(pinJsonFile);
        const pngFile = pathImageFile(projectId, timestamp, id);
        const pinPngFile = pathImageFile(projectId, pinInfo.timestamp, id);
        if (await pathExists(pinPngFile)) {
            diffZoneCount = await parsePng(
                data,
                pngFile,
                jsonFile,
                pinPngFile,
                pinInfo,
            );
        } else {
            info('DIFF', 'new png');
        }
    } else if (crawler.autopin) {
        await copy(jsonFile, pinJsonFile);
    }
    return {
        diffZoneCount,
    };
}
