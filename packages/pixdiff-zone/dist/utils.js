"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function groupOverlappingZone(zones) {
    if (zones.length < 2) {
        return zones;
    }
    const groupedZones = [];
    let newZone;
    zones.forEach((zone, index) => {
        if (!newZone) {
            newZone = zone;
        }
        else if (zoneOverlap(newZone, zone)) {
            newZone = {
                xMin: Math.min(zone.xMin, newZone.xMin),
                xMax: Math.max(zone.xMax, newZone.xMax),
                yMin: Math.min(zone.yMin, newZone.yMin),
                yMax: Math.max(zone.yMax, newZone.yMax),
            };
        }
        else {
            groupedZones.push(newZone);
            newZone = zone;
        }
    });
    groupedZones.push(newZone);
    return groupedZones;
}
exports.groupOverlappingZone = groupOverlappingZone;
function zoneOverlap(zoneA, zoneB) {
    return zoneA.xMin < zoneB.xMax
        && zoneB.xMin < zoneA.xMax
        && zoneA.yMin < zoneB.yMax
        && zoneB.yMin < zoneA.yMax;
}
exports.zoneOverlap = zoneOverlap;
function getDiffZone(pixelDiff) {
    const SPACING = 10;
    const zones = [];
    pixelDiff.forEach(({ x, y }) => {
        let hasZone = false;
        zones.forEach(({ xMin, yMin, xMax, yMax }, index) => {
            if (x > xMin - SPACING && x < xMax + SPACING && y > yMin - SPACING && y < yMax + SPACING) {
                zones[index] = {
                    xMin: Math.min(x, xMin),
                    xMax: Math.max(x, xMax),
                    yMin: Math.min(y, yMin),
                    yMax: Math.max(y, yMax),
                };
                hasZone = true;
                return;
            }
        });
        if (!hasZone) {
            zones.push({
                xMin: x,
                xMax: x,
                yMin: y,
                yMax: y,
            });
        }
    });
    const groupedZones = groupOverlappingZone(zones);
    return groupedZones;
}
exports.getDiffZone = getDiffZone;
function grayPixel(image, i, alpha) {
    const r = image.data[i + 0];
    const g = image.data[i + 1];
    const b = image.data[i + 2];
    return blend(rgb2y({ r, g, b }), alpha * image.data[i + 3] / 255);
}
exports.grayPixel = grayPixel;
function antialiased(img, xMin, yMin, img2) {
    const { width, height } = img;
    const x0 = Math.max(xMin - 1, 0);
    const y0 = Math.max(yMin - 1, 0);
    const xMax = Math.min(xMin + 1, width - 1);
    const yMax = Math.min(yMin + 1, height - 1);
    const pos = (yMin * width + xMin) * 4;
    let zeroes = xMin === x0 || xMin === xMax || yMin === y0 || yMin === yMax ? 1 : 0;
    let min = 0;
    let max = 0;
    let minX;
    let minY;
    let maxX;
    let maxY;
    for (let x = x0; x <= xMax; x++) {
        for (let y = y0; y <= yMax; y++) {
            if (x === xMin && y === yMin) {
                continue;
            }
            const delta = colorDelta(img, img, pos, (y * width + x) * 4, true);
            if (delta === 0) {
                zeroes++;
                if (zeroes > 2) {
                    return false;
                }
            }
            else if (delta < min) {
                min = delta;
                minX = x;
                minY = y;
            }
            else if (delta > max) {
                max = delta;
                maxX = x;
                maxY = y;
            }
        }
    }
    if (min === 0 || max === 0) {
        return false;
    }
    return (hasManySiblings(img, minX, minY) && hasManySiblings(img2, minX, minY)) ||
        (hasManySiblings(img, maxX, maxY) && hasManySiblings(img2, maxX, maxY));
}
exports.antialiased = antialiased;
function hasManySiblings({ data, width, height }, xMin, yMin) {
    const x0 = Math.max(xMin - 1, 0);
    const y0 = Math.max(yMin - 1, 0);
    const xMax = Math.min(xMin + 1, width - 1);
    const yMax = Math.min(yMin + 1, height - 1);
    const pos = (yMin * width + xMin) * 4;
    let zeroes = xMin === x0 || xMin === xMax || yMin === y0 || yMin === yMax ? 1 : 0;
    for (let x = x0; x <= xMax; x++) {
        for (let y = y0; y <= yMax; y++) {
            if (x === xMin && y === yMin) {
                continue;
            }
            const pos2 = (y * width + x) * 4;
            if (data[pos] === data[pos2] &&
                data[pos + 1] === data[pos2 + 1] &&
                data[pos + 2] === data[pos2 + 2] &&
                data[pos + 3] === data[pos2 + 3]) {
                zeroes++;
            }
            if (zeroes > 2) {
                return true;
            }
        }
    }
    return false;
}
exports.hasManySiblings = hasManySiblings;
function colorDelta(img1, img2, k, m, yOnly) {
    let r1 = img1.data[k + 0];
    let g1 = img1.data[k + 1];
    let b1 = img1.data[k + 2];
    let a1 = img1.data[k + 3];
    let r2 = img2.data[m + 0];
    let g2 = img2.data[m + 1];
    let b2 = img2.data[m + 2];
    let a2 = img2.data[m + 3];
    if (a1 === a2 && r1 === r2 && g1 === g2 && b1 === b2) {
        return 0;
    }
    if (a1 < 255) {
        a1 /= 255;
        r1 = blend(r1, a1);
        g1 = blend(g1, a1);
        b1 = blend(b1, a1);
    }
    if (a2 < 255) {
        a2 /= 255;
        r2 = blend(r2, a2);
        g2 = blend(g2, a2);
        b2 = blend(b2, a2);
    }
    const y = rgb2y({ r: r1, g: g1, b: b1 }) - rgb2y({ r: r2, g: g2, b: b2 });
    if (yOnly) {
        return y;
    }
    const i = rgb2i({ r: r1, g: g1, b: b1 }) - rgb2i({ r: r2, g: g2, b: b2 });
    const q = rgb2q({ r: r1, g: g1, b: b1 }) - rgb2q({ r: r2, g: g2, b: b2 });
    return 0.5053 * y * y + 0.299 * i * i + 0.1957 * q * q;
}
exports.colorDelta = colorDelta;
function rgb2y({ r, g, b }) { return r * 0.29889531 + g * 0.58662247 + b * 0.11448223; }
exports.rgb2y = rgb2y;
function rgb2i({ r, g, b }) { return r * 0.59597799 - g * 0.27417610 - b * 0.32180189; }
exports.rgb2i = rgb2i;
function rgb2q({ r, g, b }) { return r * 0.21147017 - g * 0.52261711 + b * 0.31114694; }
exports.rgb2q = rgb2q;
function blend(c, a) {
    return 255 + (c - 255) * a;
}
exports.blend = blend;
//# sourceMappingURL=utils.js.map