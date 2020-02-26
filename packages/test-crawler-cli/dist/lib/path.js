"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const test_crawler_core_1 = require("test-crawler-core");
function pathProjectsFolder() {
    return path_1.join(test_crawler_core_1.ROOT_FOLDER, test_crawler_core_1.PROJECT_FOLDER);
}
exports.pathProjectsFolder = pathProjectsFolder;
function pathQueueFolder(projectId, timestamp) {
    return path_1.join(test_crawler_core_1.ROOT_FOLDER, test_crawler_core_1.PROJECT_FOLDER, projectId, test_crawler_core_1.CRAWL_FOLDER, timestamp, test_crawler_core_1.QUEUE_FOLDER);
}
exports.pathQueueFolder = pathQueueFolder;
function pathQueueFile(projectId, timestamp, id) {
    return path_1.join(test_crawler_core_1.ROOT_FOLDER, test_crawler_core_1.PROJECT_FOLDER, projectId, test_crawler_core_1.CRAWL_FOLDER, timestamp, test_crawler_core_1.QUEUE_FOLDER, `${id}.json`);
}
exports.pathQueueFile = pathQueueFile;
function pathSiblingFile(projectId, timestamp, id) {
    return path_1.join(test_crawler_core_1.ROOT_FOLDER, test_crawler_core_1.PROJECT_FOLDER, projectId, test_crawler_core_1.CRAWL_FOLDER, timestamp, 'sibling', id);
}
exports.pathSiblingFile = pathSiblingFile;
function pathCrawlFolder(projectId) {
    return path_1.join(test_crawler_core_1.ROOT_FOLDER, test_crawler_core_1.PROJECT_FOLDER, projectId, test_crawler_core_1.CRAWL_FOLDER);
}
exports.pathCrawlFolder = pathCrawlFolder;
function pathResultFolder(projectId, timestamp) {
    return path_1.join(test_crawler_core_1.ROOT_FOLDER, test_crawler_core_1.PROJECT_FOLDER, projectId, test_crawler_core_1.CRAWL_FOLDER, timestamp);
}
exports.pathResultFolder = pathResultFolder;
function pathCrawlerFile(projectId, timestamp) {
    return path_1.join(test_crawler_core_1.ROOT_FOLDER, test_crawler_core_1.PROJECT_FOLDER, projectId, test_crawler_core_1.CRAWL_FOLDER, timestamp, `_.json`);
}
exports.pathCrawlerFile = pathCrawlerFile;
function pathInfoFile(projectId, timestamp, id) {
    return path_1.join(test_crawler_core_1.ROOT_FOLDER, test_crawler_core_1.PROJECT_FOLDER, projectId, test_crawler_core_1.CRAWL_FOLDER, timestamp, `${id}.json`);
}
exports.pathInfoFile = pathInfoFile;
function pathSnapshotFolder(projectId) {
    return path_1.join(test_crawler_core_1.ROOT_FOLDER, test_crawler_core_1.PROJECT_FOLDER, projectId, test_crawler_core_1.SNAPSHOT_FOLDER);
}
exports.pathSnapshotFolder = pathSnapshotFolder;
function pathImageFile(projectId, timestamp, id) {
    return path_1.join(test_crawler_core_1.ROOT_FOLDER, test_crawler_core_1.PROJECT_FOLDER, projectId, test_crawler_core_1.SNAPSHOT_FOLDER, `${timestamp}-${id}.png`);
}
exports.pathImageFile = pathImageFile;
function pathSourceFile(projectId, timestamp, id) {
    return path_1.join(test_crawler_core_1.ROOT_FOLDER, test_crawler_core_1.PROJECT_FOLDER, projectId, test_crawler_core_1.SNAPSHOT_FOLDER, `${timestamp}-${id}.html`);
}
exports.pathSourceFile = pathSourceFile;
function pathPinInfoFile(projectId, id) {
    return path_1.join(test_crawler_core_1.ROOT_FOLDER, test_crawler_core_1.PROJECT_FOLDER, projectId, test_crawler_core_1.PIN_FOLDER, `${id}.json`);
}
exports.pathPinInfoFile = pathPinInfoFile;
function pathProjectFile(projectId) {
    return path_1.join(test_crawler_core_1.ROOT_FOLDER, test_crawler_core_1.PROJECT_FOLDER, projectId, 'project.json');
}
exports.pathProjectFile = pathProjectFile;
function pathCodeJsFile(projectId, id) {
    return path_1.join(test_crawler_core_1.ROOT_FOLDER, test_crawler_core_1.PROJECT_FOLDER, projectId, test_crawler_core_1.CODE_FOLDER, `${id}.js`);
}
exports.pathCodeJsFile = pathCodeJsFile;
function pathCodeListFile(projectId) {
    return path_1.join(test_crawler_core_1.ROOT_FOLDER, test_crawler_core_1.PROJECT_FOLDER, projectId, test_crawler_core_1.CODE_FOLDER, `list.json`);
}
exports.pathCodeListFile = pathCodeListFile;
//# sourceMappingURL=path.js.map