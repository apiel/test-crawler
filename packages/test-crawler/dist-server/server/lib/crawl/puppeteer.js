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
const puppeteer_1 = require("puppeteer");
const logol_1 = require("logol");
const config_1 = require("../config");
const fs_extra_1 = require("fs-extra");
const _1 = require(".");
function startPuppeteer(viewport, filePath, crawler, projectId, id, url, distFolder) {
    return __awaiter(this, void 0, void 0, function* () {
        const browser = yield puppeteer_1.launch({});
        const page = yield browser.newPage();
        yield page.setUserAgent(config_1.USER_AGENT);
        yield page.setViewport(viewport);
        yield page.goto(url, {
            waitUntil: 'networkidle2',
            timeout: config_1.TIMEOUT,
        });
        const html = yield page.content();
        yield fs_extra_1.writeFile(filePath('html'), html);
        const metrics = yield page.metrics();
        const performance = JSON.parse(yield page.evaluate(() => JSON.stringify(window.performance)));
        let codeErr;
        let links;
        try {
            const injectLinks = yield page.$$eval('a', as => as.map(a => a.href));
            links = yield _1.injectCodes(page, projectId, id, url, injectLinks, distFolder, crawler);
        }
        catch (err) {
            codeErr = err.toString();
            logol_1.error('Something went wrong while injecting the code', id, url, err);
        }
        yield page.screenshot({ path: filePath('png'), fullPage: true });
        const png = { width: viewport.width };
        yield browser.close();
        logol_1.info('browser closed', url);
        return { links, url, id, performance, metrics, png, viewport, error: codeErr };
    });
}
exports.startPuppeteer = startPuppeteer;
