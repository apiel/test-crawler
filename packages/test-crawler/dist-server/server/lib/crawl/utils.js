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
function pathQueueFolder(projectId, timestamp) {
    return path_1.join(config_1.PROJECT_FOLDER, projectId, config_1.CRAWL_FOLDER, timestamp, config_1.QUEUE_FOLDER);
}
exports.pathQueueFolder = pathQueueFolder;
function pathQueueFile(projectId, timestamp, id) {
    return path_1.join(config_1.PROJECT_FOLDER, projectId, config_1.CRAWL_FOLDER, timestamp, config_1.QUEUE_FOLDER, `${id}.json`);
}
exports.pathQueueFile = pathQueueFile;
function pathSiblingFile(projectId, timestamp, id) {
    return path_1.join(config_1.PROJECT_FOLDER, projectId, config_1.CRAWL_FOLDER, timestamp, 'sibling', id);
}
exports.pathSiblingFile = pathSiblingFile;
function pathCrawlFolder(projectId) {
    return path_1.join(config_1.PROJECT_FOLDER, projectId, config_1.CRAWL_FOLDER);
}
exports.pathCrawlFolder = pathCrawlFolder;
function pathResultFolder(projectId, timestamp) {
    return path_1.join(config_1.PROJECT_FOLDER, projectId, config_1.CRAWL_FOLDER, timestamp);
}
exports.pathResultFolder = pathResultFolder;
function pathCrawlerFile(projectId, timestamp) {
    return path_1.join(config_1.PROJECT_FOLDER, projectId, config_1.CRAWL_FOLDER, timestamp, `_.json`);
}
exports.pathCrawlerFile = pathCrawlerFile;
function pathInfoFile(projectId, timestamp, id) {
    return path_1.join(config_1.PROJECT_FOLDER, projectId, config_1.CRAWL_FOLDER, timestamp, `${id}.json`);
}
exports.pathInfoFile = pathInfoFile;
function pathSnapshotFolder(projectId) {
    return path_1.join(config_1.PROJECT_FOLDER, projectId, config_1.SNAPSHOT_FOLDER);
}
exports.pathSnapshotFolder = pathSnapshotFolder;
function pathImageFile(projectId, timestamp, id) {
    return path_1.join(config_1.PROJECT_FOLDER, projectId, config_1.SNAPSHOT_FOLDER, `${timestamp}-${id}.png`);
}
exports.pathImageFile = pathImageFile;
function pathSourceFile(projectId, timestamp, id) {
    return path_1.join(config_1.PROJECT_FOLDER, projectId, config_1.SNAPSHOT_FOLDER, `${timestamp}-${id}.html`);
}
exports.pathSourceFile = pathSourceFile;
function pathPinInfoFile(projectId, id) {
    return path_1.join(config_1.PROJECT_FOLDER, projectId, config_1.PIN_FOLDER, `${id}.json`);
}
exports.pathPinInfoFile = pathPinInfoFile;
function pathProjectFile(projectId) {
    return path_1.join(config_1.PROJECT_FOLDER, projectId, 'project.json');
}
exports.pathProjectFile = pathProjectFile;
function pathCodeJsFile(projectId, id) {
    return path_1.join(config_1.ROOT_FOLDER, config_1.PROJECT_FOLDER, projectId, config_1.CODE_FOLDER, `${id}.js`);
}
exports.pathCodeJsFile = pathCodeJsFile;
