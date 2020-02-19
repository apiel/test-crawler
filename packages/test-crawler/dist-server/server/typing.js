"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ChangeType;
(function (ChangeType) {
    ChangeType["setZoneStatus"] = "setZoneStatus";
    ChangeType["pin"] = "pin";
})(ChangeType = exports.ChangeType || (exports.ChangeType = {}));
var ChangeStatus;
(function (ChangeStatus) {
    ChangeStatus["valid"] = "valid";
    ChangeStatus["zonePin"] = "zone-pin";
    ChangeStatus["report"] = "report";
    ChangeStatus["pin"] = "pin";
    ChangeStatus["diff"] = "diff";
})(ChangeStatus = exports.ChangeStatus || (exports.ChangeStatus = {}));
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
