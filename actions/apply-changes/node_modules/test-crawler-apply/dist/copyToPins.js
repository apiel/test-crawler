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
const utils_1 = require("./utils");
function copyToPins({ srcBase, dstBase, }) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield utils_1.readJson(`${srcBase}.json`);
        if ((_a = data) === null || _a === void 0 ? void 0 : _a.png) {
            data.png.diff = {
                pixelDiffRatio: 0,
                zones: [],
            };
            if (data.png.diff.pixelDiffRatio > 0) {
                yield utils_1.writeFileAsync(`${srcBase}.json`, JSON.stringify(data, null, 4));
            }
        }
        yield utils_1.writeFileAsync(`${dstBase}.json`, JSON.stringify(data, null, 4));
        yield utils_1.copyFileAsync(`${srcBase}.html`, `${dstBase}.html`);
        yield utils_1.copyFileAsync(`${srcBase}.png`, `${dstBase}.png`);
        return data;
    });
}
exports.copyToPins = copyToPins;
//# sourceMappingURL=copyToPins.js.map