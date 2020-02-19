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
const util_1 = require("util");
const fs_1 = require("fs");
exports.writeFileAsync = util_1.promisify(fs_1.writeFile);
exports.copyFileAsync = util_1.promisify(fs_1.copyFile);
const readFileAsync = util_1.promisify(fs_1.readFile);
function readJson(file) {
    return __awaiter(this, void 0, void 0, function* () {
        const content = yield readFileAsync(file);
        return JSON.parse(content.toString());
    });
}
exports.readJson = readJson;
//# sourceMappingURL=utils.js.map