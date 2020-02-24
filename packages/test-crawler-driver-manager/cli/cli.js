#!/usr/bin/env node
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
const logol_1 = require("logol");
const lib_1 = require("../lib");
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        logol_1.info('Test-crawler driver manager');
        const [, , jsonItems, destination] = process.argv;
        if (!jsonItems) {
            logol_1.warn('Missing parameter, please provide json.');
            logol_1.info(`test-crawler-driver-manager '${JSON.stringify([
                { type: 'Chrome', options: { platform: 'darwin' } },
            ])}' optional_destination_folder`);
            logol_1.info('Driver', lib_1.DriverType);
            logol_1.info('Platform', lib_1.Platform);
            logol_1.info('Arch', lib_1.Arch);
            return;
        }
        const items = JSON.parse(jsonItems);
        for (const { type, options } of items) {
            yield lib_1.driver(type, options, destination);
        }
    });
}
start();
//# sourceMappingURL=cli.js.map