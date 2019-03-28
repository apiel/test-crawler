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
const md5 = require("md5");
const config_1 = require("./config");
const path_1 = require("path");
function getFolders() {
    return __awaiter(this, void 0, void 0, function* () {
        const folders = yield fs_extra_1.readdir(config_1.CRAWL_FOLDER);
        folders.sort();
        return folders;
    });
}
exports.getFolders = getFolders;
exports.getFilePath = (id, distFolder) => (extension) => {
    return path_1.join(distFolder, `${id}.${extension}`);
};
function addToQueue(url, distFolder) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = md5(url);
        const histFile = exports.getFilePath(id, distFolder)('json');
        const queueFile = exports.getFilePath(id, getQueueFolder(distFolder))('json');
        if (!(yield fs_extra_1.pathExists(queueFile)) && !(yield fs_extra_1.pathExists(histFile))) {
            yield savePageInfo(queueFile, { url, id });
            return true;
        }
        return false;
    });
}
exports.addToQueue = addToQueue;
function getQueueFolder(distFolder) {
    return path_1.join(distFolder, 'queue');
}
exports.getQueueFolder = getQueueFolder;
function savePageInfo(file, pageData) {
    return fs_extra_1.writeJson(file, pageData, { spaces: 4 });
}
exports.savePageInfo = savePageInfo;
//# sourceMappingURL=utils.js.map