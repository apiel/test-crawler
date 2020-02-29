"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isomor_server_1 = require("isomor-server");
function default_1(app) {
    isomor_server_1.setWsDefaultConfig({ withCookie: true });
}
exports.default = default_1;
