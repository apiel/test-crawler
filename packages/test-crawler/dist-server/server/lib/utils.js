"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
exports.getFilePath = (id, distFolder) => (extension) => {
    return path_1.join(distFolder, `${id}.${extension}`);
};
