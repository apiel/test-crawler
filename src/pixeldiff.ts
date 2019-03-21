import { Image, Color, Options, Zone } from './pixeldiffTypes';
import { colorDelta, antialiased, blend, rgb2y, grayPixel } from './pixeldiffUtils';

const defaultOptions: Options = {
    threshold: 0.1,
    includeAntiAliasing: false,
    drawPixelDiff: true,
    drawZonesDiff: true,
};

const pixelDiff: Array<{ x: number, y: number }> = [];

export function pixelmatch(
    img1: Image,
    img2: Image,
    output: Image,
    options: Options = {},
) {
    if (img1.data.length !== img2.data.length) {
        throw new Error('Image sizes do not match.');
    }

    const { width, height } = img1;
    const { threshold, includeAntiAliasing, drawPixelDiff, drawZonesDiff } = { ...defaultOptions, ...options };

    // maximum acceptable square distance between two colors;
    // 35215 is the maximum possible value for the YIQ difference metric
    const maxDelta = 35215 * threshold * threshold;
    let diff = 0;

    // compare each pixel of one image against the other one
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {

            const pos = (y * width + x) * 4;

            // squared YUV distance between colors at this pixel position
            const delta = colorDelta(img1, img2, pos, pos);

            // the color difference is above the threshold
            if (delta > maxDelta) {
                const isAntiAliasing = antialiased(img1, x, y, img2)
                    || antialiased(img2, x, y, img1);

                // check it's a real rendering difference or just anti-aliasing
                if (!includeAntiAliasing && isAntiAliasing) {
                    // one of the pixels is anti-aliasing; draw as yellow and do not count as difference
                    if (output && drawPixelDiff) {
                        drawPixel(output, pos, { r: 255, g: 255, b: 0 });
                    }

                } else {
                    // found substantial difference not caused by anti-aliasing; draw it as red
                    if (output && drawPixelDiff) {
                        drawPixel(output, pos, { r: 255, g: 0, b: 0 });
                    }
                    pixelDiff.push({ x, y });
                    diff++;
                }

            } else if (output) {
                // pixels are similar; draw background as grayscale image blended with white
                const val = grayPixel(img1, pos, 0.1);
                drawPixel(output, pos, { r: val, g: val, b: val });
            }
        }
    }

    const zones = getDiffZone();
    if (output && drawZonesDiff) {
        drawZones(zones, output);
    }

    // return the number of different pixels
    return { diff, zones };
}

export function drawPixel(image: Image, pos: number, { r, g, b }: Color) {
    image.data[pos + 0] = r;
    image.data[pos + 1] = g;
    image.data[pos + 2] = b;
    image.data[pos + 3] = 255;
}

export function getDiffZone() {
    const SPACING = 10;
    const zones: Zone[] = [];
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

function groupOverlappingZone(zones: Zone[]) {
    const groupedZones: Zone[] = [];
    let newZone: Zone;
    zones.forEach((zone, index) => {
        if (!newZone) {
            newZone = zone;
        } else if (zoneOverlap(newZone, zone)) {
            newZone = {
                xMin: Math.min(zone.xMin, newZone.xMin),
                xMax: Math.max(zone.xMax, newZone.xMax),
                yMin: Math.min(zone.yMin, newZone.yMin),
                yMax: Math.max(zone.yMax, newZone.yMax),
            };
        } else {
            groupedZones.push(newZone);
            newZone = zone;
        }
    });
    groupedZones.push(newZone);

    return groupedZones;
}

function zoneOverlap(zoneA: Zone, zoneB: Zone): boolean {
    return zoneA.xMin < zoneB.xMax
        && zoneB.xMin < zoneA.xMax
        && zoneA.yMin < zoneB.yMax
        && zoneB.yMin < zoneA.yMax;
}

function drawZones(zones: Zone[], output: Image) {
    zones.forEach(zone => {
        drawZone(zone, output);
    });
}

function drawZone(zone: Zone, output: Image) {
    drawLine(zone.xMin, zone.yMin, zone.xMax, zone.yMin, output);
    drawLine(zone.xMax, zone.yMin, zone.xMax, zone.yMax, output);
    drawLine(zone.xMin, zone.yMax, zone.xMax, zone.yMax, output);
    drawLine(zone.xMin, zone.yMin, zone.xMin, zone.yMax, output);
}

function drawLine(x0: number, y0: number, x1: number, y1: number, output: Image) {
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = (x0 < x1) ? 1 : -1;
    const sy = (y0 < y1) ? 1 : -1;
    let err = dx - dy;

    while (true) {

        const pos = (y0 * output.width + x0) * 4;

        drawPixel(output, pos, { r: 0, g: 250, b: 0 });

        if ((x0 === x1) && (y0 === y1)) {
            break;
        }

        const e2 = 2 * err;
        if (e2 > -dy) { err -= dy; x0 += sx; }
        if (e2 < dx) { err += dx; y0 += sy; }
    }
}
