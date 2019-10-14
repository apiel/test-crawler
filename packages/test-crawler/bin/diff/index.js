"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const logol_1 = require("logol");
const utils_1 = require("../../dist-server/server/lib/utils");
const config_1 = require("../../dist-server/server/lib/config");
const pngjs_1 = require("pngjs");
const pixdiff_zone_1 = require("pixdiff-zone");
const fs_extra_1 = require("fs-extra");
const lib_1 = require("../../dist-server/server/lib");
function parsePng(data, filePath, basePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const file = filePath('png');
        const { id, url } = data;
        const actual = yield fs_extra_1.readFile(file);
        const expected = yield fs_extra_1.readFile(basePath('png'));
        const rawActual = pngjs_1.PNG.sync.read(actual);
        const rawExpected = pngjs_1.PNG.sync.read(expected);
        let { width, height } = rawActual;
        width = Math.min(width, rawExpected.width);
        height = Math.min(height, rawExpected.height);
        const diffImage = new pngjs_1.PNG({ width, height });
        const { diff, zones } = pixdiff_zone_1.pixdiff(cropPng(rawActual, width, height), cropPng(rawExpected, width, height), diffImage);
        const totalPixels = width * height;
        const pixelDiffRatio = diff / totalPixels;
        logol_1.info('PNG', id, url, `diff ratio: ${pixelDiffRatio}`);
        logol_1.info('PNG', 'zone', zones);
        if (pixelDiffRatio) {
            const buffer = pngjs_1.PNG.sync.write(diffImage, { colorType: 6 });
            const diffFile = `${file}.diff.png`;
            yield fs_extra_1.writeFile(diffFile, buffer);
            logol_1.info('PNG', id, url, 'diff file:', diffFile);
        }
        data.png.diff = {
            pixelDiffRatio,
            zones: yield parseZones(basePath, zones),
        };
        yield fs_extra_1.writeJSON(filePath('json'), data, { spaces: 4 });
        return zones.length;
    });
}
function cropPng(png, width, height) {
    const origin = new pngjs_1.PNG({ width: png.width, height: png.height });
    origin.data = png.data;
    const cropped = new pngjs_1.PNG({ width, height });
    origin.bitblt(cropped, 0, 0, width, height);
    return cropped;
}
function parseZones(basePath, zones) {
    return __awaiter(this, void 0, void 0, function* () {
        const base = yield fs_extra_1.readJson(basePath('json'));
        const baseZones = base.png.diff.zones.map(z => z.zone);
        return zones.map(zone => ({
            zone,
            status: pixdiff_zone_1.groupOverlappingZone([...baseZones, zone]).length === baseZones.length ? 'valid' : 'diff',
        }));
    });
}
function prepare(id, distFolder, crawler) {
    return __awaiter(this, void 0, void 0, function* () {
        const basePath = utils_1.getFilePath(id, config_1.BASE_FOLDER);
        const filePath = utils_1.getFilePath(id, distFolder);
        const data = yield fs_extra_1.readJson(filePath('json'));
        let diffZoneCount = 0;
        if (yield fs_extra_1.pathExists(basePath('json'))) {
            if (yield fs_extra_1.pathExists(basePath('png'))) {
                diffZoneCount = yield parsePng(data, filePath, basePath);
            }
            else {
                logol_1.info('DIFF', 'new png');
            }
        }
        else if (crawler.autopin) {
            const crawlerProvider = new lib_1.CrawlerProvider();
            crawlerProvider.copyToBase(crawler.timestamp.toString(), id);
        }
        return {
            diffZoneCount,
        };
    });
}
exports.prepare = prepare;
//# sourceMappingURL=index.js.map