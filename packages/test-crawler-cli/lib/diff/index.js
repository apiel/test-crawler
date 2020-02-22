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
const pngjs_1 = require("pngjs");
const pixdiff_zone_1 = require("pixdiff-zone");
const fs_extra_1 = require("fs-extra");
const test_crawler_core_1 = require("test-crawler-core");
const path_1 = require("../path");
function parsePng(data, pngFile, jsonFile, pinPngFile, pinInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id, url } = data;
        const actual = yield fs_extra_1.readFile(pngFile);
        const expected = yield fs_extra_1.readFile(pinPngFile);
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
            const diffFile = `${pngFile}.diff.png`;
            yield fs_extra_1.writeFile(diffFile, buffer);
            logol_1.info('PNG', id, url, 'diff file:', diffFile);
        }
        data.png.diff = {
            pixelDiffRatio,
            zones: yield parseZones(pinInfo, zones),
        };
        yield fs_extra_1.writeJSON(jsonFile, data, { spaces: 4 });
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
function parseZones(pinInfo, zones) {
    return __awaiter(this, void 0, void 0, function* () {
        const baseZones = pinInfo.png.diff.zones.map(z => z.zone);
        return zones.map(zone => ({
            zone,
            status: pixdiff_zone_1.groupOverlappingZone([...baseZones, zone]).length ===
                baseZones.length
                ? test_crawler_core_1.ZoneStatus.valid
                : test_crawler_core_1.ZoneStatus.diff,
        }));
    });
}
function prepare(projectId, timestamp, id, crawler) {
    return __awaiter(this, void 0, void 0, function* () {
        const jsonFile = path_1.pathInfoFile(projectId, timestamp, id);
        const pinJsonFile = path_1.pathPinInfoFile(projectId, id);
        const data = yield fs_extra_1.readJson(jsonFile);
        let diffZoneCount = 0;
        if (yield fs_extra_1.pathExists(pinJsonFile)) {
            const pinInfo = yield fs_extra_1.readJson(pinJsonFile);
            const pngFile = path_1.pathImageFile(projectId, timestamp, id);
            const pinPngFile = path_1.pathImageFile(projectId, pinInfo.timestamp, id);
            if (yield fs_extra_1.pathExists(pinPngFile)) {
                diffZoneCount = yield parsePng(data, pngFile, jsonFile, pinPngFile, pinInfo);
            }
            else {
                logol_1.info('DIFF', 'new png');
            }
        }
        else if (crawler.autopin) {
            yield fs_extra_1.copy(jsonFile, pinJsonFile);
        }
        return {
            diffZoneCount,
        };
    });
}
exports.prepare = prepare;
//# sourceMappingURL=index.js.map