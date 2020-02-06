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
const Remote_1 = require("./Remote");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const config_1 = require("../config");
class LocalRemote extends Remote_1.Remote {
    constructor(projectId) {
        super();
        this.projectId = projectId;
    }
    readdir(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const fullpath = this.getPath(path);
            yield fs_extra_1.mkdirp(fullpath);
            return fs_extra_1.readdir(fullpath);
        });
    }
    read(path) {
        return fs_extra_1.readFile(this.getPath(path));
    }
    readJSON(path) {
        return fs_extra_1.readJSON(this.getPath(path));
    }
    getPath(path) {
        return path_1.join(config_1.PROJECT_FOLDER, this.projectId, path);
    }
}
exports.LocalRemote = LocalRemote;
