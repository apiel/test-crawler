"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chrome_1 = require("./chrome");
exports.getChromedriver = chrome_1.getChromedriver;
exports.getChromeDownloadUrl = chrome_1.getChromeDownloadUrl;
exports.downloadChrome = chrome_1.downloadChrome;
var gecko_1 = require("./gecko");
exports.getGeckodriver = gecko_1.getGeckodriver;
exports.getGeckoDownloadUrl = gecko_1.getGeckoDownloadUrl;
var ie_1 = require("./ie");
exports.getIedriver = ie_1.getIedriver;
exports.getIeDownloadUrl = ie_1.getIeDownloadUrl;
exports.downloadIe = ie_1.downloadIe;
var Platform;
(function (Platform) {
    Platform["mac"] = "darwin";
    Platform["linux"] = "linux";
    Platform["win"] = "win";
})(Platform = exports.Platform || (exports.Platform = {}));
var Arch;
(function (Arch) {
    Arch["x64"] = "64";
    Arch["x32"] = "32";
})(Arch = exports.Arch || (exports.Arch = {}));
//# sourceMappingURL=index.js.map