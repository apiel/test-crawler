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
let pushList = [];
function pushPush(push) {
    pushList.push(push);
}
exports.pushPush = pushPush;
function sendPush(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i = pushList.length - 1; i >= 0; i--) {
            if (pushList[i]) {
                try {
                    yield pushList[i](payload);
                }
                catch (error) {
                    logol_1.info('Push was not sent, remove from pusher list.');
                    delete pushList[i];
                }
            }
        }
        pushList = pushList.filter(p => p);
    });
}
exports.sendPush = sendPush;
//# sourceMappingURL=pusher.js.map