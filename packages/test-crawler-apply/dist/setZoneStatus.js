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
const pixdiff_zone_1 = require("pixdiff-zone");
const utils_1 = require("./utils");
function setZoneStatus({ jsonFile, pinJsonFile, index, status, }) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield utils_1.readJson(jsonFile);
        if (status === 'zone-pin') {
            const pin = yield utils_1.readJson(pinJsonFile);
            if (((_c = (_b = (_a = pin) === null || _a === void 0 ? void 0 : _a.png) === null || _b === void 0 ? void 0 : _b.diff) === null || _c === void 0 ? void 0 : _c.zones) && ((_f = (_e = (_d = data) === null || _d === void 0 ? void 0 : _d.png) === null || _e === void 0 ? void 0 : _e.diff) === null || _f === void 0 ? void 0 : _f.zones)) {
                pin.png.diff.zones.push(Object.assign(Object.assign({}, data.png.diff.zones[index]), { status }));
                const zones = pin.png.diff.zones.map((item) => item.zone);
                zones.sort((a, b) => a.xMin * a.yMin - b.xMin * b.yMin);
                const groupedZones = pixdiff_zone_1.groupOverlappingZone(zones);
                pin.png.diff.zones = groupedZones.map(zone => ({ zone, status }));
            }
            yield utils_1.writeFileAsync(pinJsonFile, JSON.stringify(pin, null, 4));
        }
        if ((_j = (_h = (_g = data) === null || _g === void 0 ? void 0 : _g.png) === null || _h === void 0 ? void 0 : _h.diff) === null || _j === void 0 ? void 0 : _j.zones) {
            data.png.diff.zones[index].status = status;
        }
        yield utils_1.writeFileAsync(jsonFile, JSON.stringify(data, null, 4));
        return data;
    });
}
exports.setZoneStatus = setZoneStatus;
//# sourceMappingURL=setZoneStatus.js.map