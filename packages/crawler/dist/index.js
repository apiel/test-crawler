"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const config_1 = require("./config");
exports.getAllCrawlers = () => __awaiter(this, void 0, void 0, function* () {
    const folders = yield fs_extra_1.readdir(config_1.CRAWL_FOLDER);
    const crawlers = yield Promise.all(folders.map(folder => fs_extra_1.readJSON(path_1.join(config_1.CRAWL_FOLDER, folder, '_.json'))));
    return crawlers;
});
//# sourceMappingURL=index.js.map