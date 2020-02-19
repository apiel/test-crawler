"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ZoneStatus;
(function (ZoneStatus) {
    ZoneStatus["valid"] = "valid";
    ZoneStatus["zonePin"] = "zone-pin";
    ZoneStatus["report"] = "report";
    ZoneStatus["diff"] = "diff";
})(ZoneStatus = exports.ZoneStatus || (exports.ZoneStatus = {}));
var Browser;
(function (Browser) {
    Browser["ChromePuppeteer"] = "chrome-puppeteer";
    Browser["FirefoxSelenium"] = "firefox-selenium";
    Browser["ChromeSelenium"] = "chrome-selenium";
    Browser["SafariSelenium"] = "safari-selenium";
    Browser["IeSelenium"] = "ie-selenium";
})(Browser = exports.Browser || (exports.Browser = {}));
var BeforeAfterType;
(function (BeforeAfterType) {
    BeforeAfterType["Before"] = "before";
    BeforeAfterType["After"] = "after";
})(BeforeAfterType = exports.BeforeAfterType || (exports.BeforeAfterType = {}));
