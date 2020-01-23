"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
exports.zoneOverlap = utils_1.zoneOverlap;
exports.groupOverlappingZone = utils_1.groupOverlappingZone;
const defaultOptions = {
    threshold: 0.1,
    includeAntiAliasing: false,
    drawPixelDiff: true,
    drawZonesDiff: true,
    zoneColor: { r: 0, g: 250, b: 0 },
    antiAliasingColor: { r: 255, g: 255, b: 0 },
    pixelDiffColor: { r: 255, g: 0, b: 0 },
};
function pixdiff(img1, img2, output, options = {}) {
    if (img1.data.length !== img2.data.length) {
        throw new Error('Image sizes do not match.');
    }
    const pixelDiff = [];
    const { width, height } = img1;
    const { threshold, includeAntiAliasing, drawPixelDiff, drawZonesDiff, zoneColor, antiAliasingColor, pixelDiffColor, } = Object.assign(Object.assign({}, defaultOptions), options);
    const maxDelta = 35215 * threshold * threshold;
    let diff = 0;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const pos = (y * width + x) * 4;
            const delta = utils_1.colorDelta(img1, img2, pos, pos);
            if (output) {
                const val = utils_1.grayPixel(img1, pos, 0.1);
                drawPixel(output, pos, { r: val, g: val, b: val });
            }
            if (delta > maxDelta) {
                const isAntiAliasing = utils_1.antialiased(img1, x, y, img2)
                    || utils_1.antialiased(img2, x, y, img1);
                if (!includeAntiAliasing && isAntiAliasing) {
                    if (output && drawPixelDiff) {
                        drawPixel(output, pos, antiAliasingColor);
                    }
                }
                else {
                    if (output && drawPixelDiff) {
                        drawPixel(output, pos, pixelDiffColor);
                    }
                    pixelDiff.push({ x, y });
                    diff++;
                }
            }
        }
    }
    const zones = utils_1.getDiffZone(pixelDiff);
    if (output && drawZonesDiff) {
        drawZones(zones, output, zoneColor);
    }
    return { diff, zones };
}
exports.pixdiff = pixdiff;
function drawPixel(image, pos, { r, g, b }) {
    image.data[pos + 0] = r;
    image.data[pos + 1] = g;
    image.data[pos + 2] = b;
    image.data[pos + 3] = 255;
}
exports.drawPixel = drawPixel;
function drawZones(zones, output, color) {
    zones.forEach(zone => {
        drawZone(zone, output, color);
    });
}
exports.drawZones = drawZones;
function drawZone(zone, output, color) {
    drawLine(zone.xMin, zone.yMin, zone.xMax, zone.yMin, output, color);
    drawLine(zone.xMax, zone.yMin, zone.xMax, zone.yMax, output, color);
    drawLine(zone.xMin, zone.yMax, zone.xMax, zone.yMax, output, color);
    drawLine(zone.xMin, zone.yMin, zone.xMin, zone.yMax, output, color);
}
exports.drawZone = drawZone;
function drawLine(x0, y0, x1, y1, output, color) {
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = (x0 < x1) ? 1 : -1;
    const sy = (y0 < y1) ? 1 : -1;
    let err = dx - dy;
    while (true) {
        const pos = (y0 * output.width + x0) * 4;
        drawPixel(output, pos, color);
        if ((x0 === x1) && (y0 === y1)) {
            break;
        }
        const e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            x0 += sx;
        }
        if (e2 < dx) {
            err += dx;
            y0 += sy;
        }
    }
}
exports.drawLine = drawLine;
//# sourceMappingURL=index.js.map