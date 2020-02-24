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
const AdmZip = require("adm-zip");
const axios_1 = require("axios");
const tar_1 = require("tar");
const fs = require("fs");
const util_1 = require("util");
const path_1 = require("path");
const _1 = require(".");
const logol_1 = require("logol");
exports.mkdir = util_1.promisify(fs.mkdir);
const writeFile = util_1.promisify(fs.writeFile);
const readFile = util_1.promisify(fs.readFile);
const exists = util_1.promisify(fs.exists);
function downloadZip(url, destination) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data } = yield axios_1.default.get(url, {
            responseType: 'arraybuffer',
        });
        const admZip = new AdmZip(data);
        return admZip.extractAllTo(destination, true);
    });
}
exports.downloadZip = downloadZip;
function downloadTar(url, destination) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios_1.default.get(url, {
            responseType: 'stream',
        });
        return new Promise((resolve, reject) => {
            response.data.pipe(tar_1.extract({ cwd: destination })
                .on('finish', resolve)
                .on('error', reject));
        });
    });
}
exports.downloadTar = downloadTar;
function getFile(platform, destination, name) {
    return path_1.join(destination, platform === _1.Platform.win ? `${name}.exe` : name);
}
exports.getFile = getFile;
function writeFileInfo(file, platform, arch, assetUrl) {
    const infoFile = `${file}.txt`;
    return writeFile(infoFile, JSON.stringify({ platform, arch, assetUrl }, null, 4));
}
exports.writeFileInfo = writeFileInfo;
function checkDriverPresent(file, platform, arch) {
    return __awaiter(this, void 0, void 0, function* () {
        const infoFile = `${file}.txt`;
        if ((yield exists(file)) && (yield exists(infoFile))) {
            const info = JSON.parse((yield readFile(infoFile)).toString());
            return (info === null || info === void 0 ? void 0 : info.platform) === platform && (info === null || info === void 0 ? void 0 : info.arch) === arch;
        }
        return false;
    });
}
exports.checkDriverPresent = checkDriverPresent;
function getDriver({ platform, destination = process.cwd(), arch = _1.Arch.x64, force = false, }, file, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!force && (yield checkDriverPresent(file, platform, arch))) {
            logol_1.info('No need to download driver.', file);
            return file;
        }
        logol_1.info('Download driver.', file);
        const assetUrl = yield fn(platform, arch, destination);
        yield writeFileInfo(file, platform, arch, assetUrl);
    });
}
exports.getDriver = getDriver;
//# sourceMappingURL=utils.js.map