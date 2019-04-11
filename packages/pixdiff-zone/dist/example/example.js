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
const pngjs_1 = require("pngjs");
const fs_extra_1 = require("fs-extra");
const src_1 = require("../src");
function parsePng(lastFile, previousFile) {
    return __awaiter(this, void 0, void 0, function* () {
        const actual = yield fs_extra_1.readFile(lastFile);
        const expected = yield fs_extra_1.readFile(previousFile);
        const rawActual = pngjs_1.PNG.sync.read(actual);
        const rawExpected = pngjs_1.PNG.sync.read(expected);
        const { width, height } = rawActual;
        const diffImage = new pngjs_1.PNG({ width, height });
        const { diff, zones } = src_1.pixdiff(rawActual, rawExpected, diffImage);
        const totalPixels = width * height;
        const diffRatio = diff / totalPixels;
        console.log('PNG', `diff ratio: ${diffRatio}`);
        console.log('PNG', 'zone', zones);
        if (diffRatio) {
            const buffer = pngjs_1.PNG.sync.write(diffImage, { colorType: 6 });
            const diffFile = `${__dirname}/diff.png`;
            fs_extra_1.writeFile(diffFile, buffer);
        }
    });
}
parsePng(`${__dirname}/a.png`, `${__dirname}/b.png`);
//# sourceMappingURL=example.js.map