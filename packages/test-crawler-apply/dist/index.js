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
const setZoneStatus_1 = require("./setZoneStatus");
const copyToPins_1 = require("./copyToPins");
exports.copyToPins = copyToPins_1.copyToPins;
function applyChanges(changes) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const change of changes) {
            if (change.type === 'copyToPins') {
                copyToPins_1.copyToPins(change.props);
            }
            else if (change.type === 'setZoneStatus') {
                setZoneStatus_1.setZoneStatus(change.props);
            }
        }
    });
}
exports.applyChanges = applyChanges;
//# sourceMappingURL=index.js.map