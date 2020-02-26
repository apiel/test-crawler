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
const os = require("os");
const path_1 = require("path");
const chrome_1 = require("./chrome");
const gecko_1 = require("./gecko");
const ie_1 = require("./ie");
var chrome_2 = require("./chrome");
exports.getChromedriver = chrome_2.getChromedriver;
exports.getChromeDownloadUrl = chrome_2.getChromeDownloadUrl;
exports.downloadChrome = chrome_2.downloadChrome;
var gecko_2 = require("./gecko");
exports.getGeckodriver = gecko_2.getGeckodriver;
exports.getGeckoDownloadUrl = gecko_2.getGeckoDownloadUrl;
exports.downloadGecko = gecko_2.downloadGecko;
var ie_2 = require("./ie");
exports.getIedriver = ie_2.getIedriver;
exports.getIeDownloadUrl = ie_2.getIeDownloadUrl;
exports.downloadIe = ie_2.downloadIe;
exports.defaultDestination = path_1.join(__dirname, '..', 'node_modules', '.bin');
exports.defaultPlatform = os.platform();
exports.defaultArch = os.arch();
var DriverType;
(function (DriverType) {
    DriverType["Gecko"] = "Gecko";
    DriverType["Chrome"] = "Chrome";
    DriverType["IE"] = "IE";
})(DriverType = exports.DriverType || (exports.DriverType = {}));
var Platform;
(function (Platform) {
    Platform["mac"] = "darwin";
    Platform["linux"] = "linux";
    Platform["win"] = "win";
})(Platform = exports.Platform || (exports.Platform = {}));
var Arch;
(function (Arch) {
    Arch["x64"] = "x64";
    Arch["x32"] = "x32";
})(Arch = exports.Arch || (exports.Arch = {}));
function setDefaultDestination(destination) {
    exports.defaultDestination = destination;
}
exports.setDefaultDestination = setDefaultDestination;
function driver(type, options, destination = exports.defaultDestination) {
    return __awaiter(this, void 0, void 0, function* () {
        const opt = Object.assign({ platform: exports.defaultPlatform, arch: exports.defaultArch, destination }, options);
        if (type === DriverType.Chrome) {
            yield chrome_1.getChromedriver(opt);
        }
        else if (type === DriverType.Gecko) {
            yield gecko_1.getGeckodriver(opt);
        }
        else if (type === DriverType.IE) {
            yield ie_1.getIedriver(opt);
        }
        else {
            logol_1.warn('Unknown driver', type);
            return;
        }
        logol_1.info('Setup driver done:', type);
    });
}
exports.driver = driver;
//# sourceMappingURL=index.js.map