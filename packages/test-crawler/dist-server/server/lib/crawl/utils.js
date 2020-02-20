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
const config_1 = require("../config");
const fs_extra_1 = require("fs-extra");
function getFolders(projectId) {
    return __awaiter(this, void 0, void 0, function* () {
        const projectFolder = path_1.join(config_1.PROJECT_FOLDER, projectId, config_1.CRAWL_FOLDER);
        yield fs_extra_1.mkdirp(projectFolder);
        const folders = yield fs_extra_1.readdir(projectFolder);
        folders.sort();
        return folders;
    });
}
exports.getFolders = getFolders;
function getQueueFolder(distFolder) {
    return path_1.join(distFolder, 'queue');
}
exports.getQueueFolder = getQueueFolder;
