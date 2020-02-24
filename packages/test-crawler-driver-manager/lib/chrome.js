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
const axios_1 = require("axios");
const _1 = require(".");
const utils_1 = require("./utils");
exports.FILE = 'chromedriver';
exports.URL = 'https://chromedriver.storage.googleapis.com';
function getChromedriver({ platform, destination = process.cwd(), arch = _1.Arch.x64, force = false, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const file = utils_1.getFile(platform, destination, exports.FILE);
        yield utils_1.getDriver({ platform, destination, arch, force }, file, downloadChrome);
        return file;
    });
}
exports.getChromedriver = getChromedriver;
function downloadChrome(platform, arch, destination) {
    return __awaiter(this, void 0, void 0, function* () {
        const assetUrl = yield getChromeDownloadUrl(platform, arch);
        yield utils_1.mkdir(destination, { recursive: true });
        yield utils_1.downloadZip(assetUrl, destination);
        return assetUrl;
    });
}
exports.downloadChrome = downloadChrome;
function getChromeDownloadUrl(platform, arch = _1.Arch.x64) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data: version } = yield axios_1.default.get(`${exports.URL}/LATEST_RELEASE`);
        const name = getName(platform, arch);
        return `${exports.URL}/${version}/${name}.zip`;
    });
}
exports.getChromeDownloadUrl = getChromeDownloadUrl;
function getName(platform, arch = _1.Arch.x64) {
    if (platform === _1.Platform.mac) {
        return 'chromedriver_mac64';
    }
    else if (platform === _1.Platform.win) {
        return 'chromedriver_win32';
    }
    return 'chromedriver_linux64';
}
//# sourceMappingURL=chrome.js.map