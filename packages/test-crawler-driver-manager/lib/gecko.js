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
const path_1 = require("path");
const _1 = require(".");
const utils_1 = require("./utils");
exports.FILE = 'geckodriver';
exports.URL = 'https://api.github.com/repos/mozilla/geckodriver/releases/latest';
function getGeckodriver({ platform, destination = process.cwd(), arch = _1.Arch.x64, force = false, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const file = utils_1.getFile(platform, destination, exports.FILE);
        yield utils_1.getDriver({ platform, destination, arch, force }, file, downloadGecko);
        return file;
    });
}
exports.getGeckodriver = getGeckodriver;
function downloadGecko(platform, arch, destination) {
    return __awaiter(this, void 0, void 0, function* () {
        const assetUrl = yield getGeckoDownloadUrl(platform, arch);
        yield utils_1.mkdir(destination, { recursive: true });
        if (path_1.extname(assetUrl) === '.zip') {
            yield utils_1.downloadZip(assetUrl, destination);
        }
        else {
            yield utils_1.downloadTar(assetUrl, destination);
        }
        return assetUrl;
    });
}
exports.downloadGecko = downloadGecko;
function getName(platform, arch = _1.Arch.x64) {
    if (platform === _1.Platform.mac) {
        return 'macos';
    }
    return `${platform}${arch}`;
}
function getGeckoDownloadUrl(platform, arch = _1.Arch.x64) {
    return __awaiter(this, void 0, void 0, function* () {
        const assets = yield getAssets();
        const name = getName(platform, arch);
        const asset = assets.find((asset) => asset.name.includes(name));
        return asset === null || asset === void 0 ? void 0 : asset.browser_download_url;
    });
}
exports.getGeckoDownloadUrl = getGeckoDownloadUrl;
let cacheAssets;
function getAssets() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!cacheAssets) {
            const { data: { assets }, } = yield axios_1.default.get(exports.URL);
            cacheAssets = assets;
        }
        return cacheAssets;
    });
}
//# sourceMappingURL=gecko.js.map