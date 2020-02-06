"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Remote_1 = require("./Remote");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const config_1 = require("../config");
class LocalRemote extends Remote_1.Remote {
    read(projectId, path) {
        return fs_extra_1.readFile(path_1.join(config_1.PROJECT_FOLDER, projectId, path));
    }
    readJSON(projectId, path) {
        return fs_extra_1.readJSON(path_1.join(config_1.PROJECT_FOLDER, projectId, path));
    }
}
exports.LocalRemote = LocalRemote;
