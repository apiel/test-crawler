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
const path_1 = require("./path");
const fs_extra_1 = require("fs-extra");
function getCodeList(projectId) {
    return __awaiter(this, void 0, void 0, function* () {
        const listPath = path_1.pathCodeListFile(projectId);
        if (yield fs_extra_1.pathExists(listPath)) {
            return fs_extra_1.readJSON(listPath);
        }
        return {};
    });
}
exports.getCodeList = getCodeList;
function generateTinestampFolder() {
    return Math.floor(Date.now() / 1000).toString();
}
exports.generateTinestampFolder = generateTinestampFolder;
//# sourceMappingURL=utils.js.map