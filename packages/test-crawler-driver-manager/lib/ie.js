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
const path_1 = require("path");
const _1 = require(".");
const utils_1 = require("./utils");
exports.FILE = 'IEDriverServer.exe';
exports.URL = 'https://selenium-release.storage.googleapis.com/3.9/IEDriverServer_%s_3.9.0.zip';
function getIedriver({ platform = _1.defaultPlatform, destination = _1.defaultDestination, arch = _1.defaultArch, force = false, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const file = path_1.join(destination, 'IEDriverServer.exe');
        yield utils_1.getDriver({ platform, destination, arch, force }, file, downloadIe);
        return file;
    });
}
exports.getIedriver = getIedriver;
function downloadIe(platform, arch, destination) {
    return __awaiter(this, void 0, void 0, function* () {
        const assetUrl = yield getIeDownloadUrl(platform, arch);
        yield utils_1.mkdir(destination, { recursive: true });
        yield utils_1.downloadZip(assetUrl, destination);
        return assetUrl;
    });
}
exports.downloadIe = downloadIe;
function getIeDownloadUrl(platform, arch = _1.Arch.x64) {
    return __awaiter(this, void 0, void 0, function* () {
        const name = arch === _1.Arch.x64 ? 'x64' : 'Win32';
        return exports.URL.replace('%s', name);
    });
}
exports.getIeDownloadUrl = getIeDownloadUrl;
//# sourceMappingURL=ie.js.map