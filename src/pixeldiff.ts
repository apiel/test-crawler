export interface Options {
    threshold?: number;
    includeAA?: boolean;
}

export function pixelmatch(
    img1: Buffer,
    img2: Buffer,
    output: Buffer,
    width: number,
    height: number,
    options: Options = {},
) {
    if (img1.length !== img2.length) {
        throw new Error('Image sizes do not match.');
    }

    const threshold = options.threshold === undefined ? 0.1 : options.threshold;

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
                const isAntiAliasing = antialiased(img1, x, y, width, height, img2)
                    || antialiased(img2, x, y, width, height, img1);

                // if (isAntiAliasing) {
                //     addPixelDiff(x, y);
                // }

                // check it's a real rendering difference or just anti-aliasing
                if (!options.includeAA && isAntiAliasing) {
                    // one of the pixels is anti-aliasing; draw as yellow and do not count as difference
                    if (output) {
                        drawPixel(output, pos, 255, 255, 0);
                    }

                } else {
                    // found substantial difference not caused by anti-aliasing; draw it as red
                    if (output) {
                        drawPixel(output, pos, 255, 0, 0);
                    }
                    addPixelDiff(x, y);
                    diff++;
                }

            } else if (output) {
                // pixels are similar; draw background as grayscale image blended with white
                const val = grayPixel(img1, pos, 0.1);
                drawPixel(output, pos, val, val, val);
            }
        }
    }

    getDiffZone(width, output);
    getDiffZone2(width, output);

    // return the number of different pixels
    return diff;
}

// check if a pixel is likely a part of anti-aliasing;
// based on "Anti-aliased Pixel and Intensity Slope Detector" paper by V. Vysniauskas, 2009

export function antialiased(
    img: Buffer,
    x1: number,
    y1: number,
    width: number,
    height: number,
    img2: Buffer,
) {
    const x0 = Math.max(x1 - 1, 0);
    const y0 = Math.max(y1 - 1, 0);
    const x2 = Math.min(x1 + 1, width - 1);
    const y2 = Math.min(y1 + 1, height - 1);
    const pos = (y1 * width + x1) * 4;
    let zeroes = x1 === x0 || x1 === x2 || y1 === y0 || y1 === y2 ? 1 : 0;
    let min = 0;
    let max = 0;
    let minX: number;
    let minY: number;
    let maxX: number;
    let maxY: number;

    // go through 8 adjacent pixels
    for (let x = x0; x <= x2; x++) {
        for (let y = y0; y <= y2; y++) {
            if (x === x1 && y === y1) {
                continue;
            }

            // brightness delta between the center pixel and adjacent one
            const delta = colorDelta(img, img, pos, (y * width + x) * 4, true);

            // count the number of equal, darker and brighter adjacent pixels
            if (delta === 0) {
                zeroes++;
                // if found more than 2 equal siblings, it's definitely not anti-aliasing
                if (zeroes > 2) {
                    return false;
                }

                // remember the darkest pixel
            } else if (delta < min) {
                min = delta;
                minX = x;
                minY = y;

                // remember the brightest pixel
            } else if (delta > max) {
                max = delta;
                maxX = x;
                maxY = y;
            }
        }
    }

    // if there are no both darker and brighter pixels among siblings, it's not anti-aliasing
    if (min === 0 || max === 0) {
        return false;
    }

    // if either the darkest or the brightest pixel has 3+ equal siblings in both images
    // (definitely not anti-aliased), this pixel is anti-aliased
    return (hasManySiblings(img, minX, minY, width, height) && hasManySiblings(img2, minX, minY, width, height)) ||
        (hasManySiblings(img, maxX, maxY, width, height) && hasManySiblings(img2, maxX, maxY, width, height));
}

// check if a pixel has 3+ adjacent pixels of the same color.
export function hasManySiblings(img: Buffer, x1: number, y1: number, width: number, height: number) {
    const x0 = Math.max(x1 - 1, 0);
    const y0 = Math.max(y1 - 1, 0);
    const x2 = Math.min(x1 + 1, width - 1);
    const y2 = Math.min(y1 + 1, height - 1);
    const pos = (y1 * width + x1) * 4;
    let zeroes = x1 === x0 || x1 === x2 || y1 === y0 || y1 === y2 ? 1 : 0;

    // go through 8 adjacent pixels
    for (let x = x0; x <= x2; x++) {
        for (let y = y0; y <= y2; y++) {
            if (x === x1 && y === y1) {
                continue;
            }

            const pos2 = (y * width + x) * 4;
            if (img[pos] === img[pos2] &&
                img[pos + 1] === img[pos2 + 1] &&
                img[pos + 2] === img[pos2 + 2] &&
                img[pos + 3] === img[pos2 + 3]) {
                zeroes++;
            }

            if (zeroes > 2) {
                return true;
            }
        }
    }

    return false;
}

// calculate color difference according to the paper "Measuring perceived color difference
// using YIQ NTSC transmission color space in mobile applications" by Y. Kotsarenko and F. Ramos

function colorDelta(img1: Buffer, img2: Buffer, k: number, m: number, yOnly?: boolean) {
    let r1 = img1[k + 0];
    let g1 = img1[k + 1];
    let b1 = img1[k + 2];
    let a1 = img1[k + 3];

    let r2 = img2[m + 0];
    let g2 = img2[m + 1];
    let b2 = img2[m + 2];
    let a2 = img2[m + 3];

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

    const y = rgb2y(r1, g1, b1) - rgb2y(r2, g2, b2);

    if (yOnly) { return y; } // brightness difference only

    const i = rgb2i(r1, g1, b1) - rgb2i(r2, g2, b2);
    const q = rgb2q(r1, g1, b1) - rgb2q(r2, g2, b2);

    return 0.5053 * y * y + 0.299 * i * i + 0.1957 * q * q;
}

function rgb2y(r: number, g: number, b: number) { return r * 0.29889531 + g * 0.58662247 + b * 0.11448223; }
function rgb2i(r: number, g: number, b: number) { return r * 0.59597799 - g * 0.27417610 - b * 0.32180189; }
function rgb2q(r: number, g: number, b: number) { return r * 0.21147017 - g * 0.52261711 + b * 0.31114694; }

// blend semi-transparent color with white
function blend(c: number, a: number) {
    return 255 + (c - 255) * a;
}

function drawPixel(output: Buffer, pos: number, r: number, g: number, b: number) {
    output[pos + 0] = r;
    output[pos + 1] = g;
    output[pos + 2] = b;
    output[pos + 3] = 255;
}

function grayPixel(img: Buffer, i: number, alpha: number) {
    const r = img[i + 0];
    const g = img[i + 1];
    const b = img[i + 2];
    return blend(rgb2y(r, g, b), alpha * img[i + 3] / 255);
}

const pixelDiff: Array<{ x: number, y: number }> = [];
function addPixelDiff(x: number, y: number) {
    // console.log('addPixel diff', x, y);
    pixelDiff.push({ x, y });
}

function getDiffZone2(width: number, output: Buffer) {
    const SPACING = 10;
    const zones: Array<{ xMin: number, yMin: number, xMax: number, yMax: number }> = [];
    pixelDiff.forEach(({x, y}) => {
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
            // console.log('zones', x, y, zones);
            // if (zones.length > 0) {
            //     process.exit();
            // }
            zones.push({
                xMin: x,
                xMax: x,
                yMin: y,
                yMax: y,
            });
        }
    });

    console.log('zones', zones);
    // console.log('pixelDiff', pixelDiff);
}

function getDiffZone(width: number, output: Buffer) {
    const xx = pixelDiff.map(({ x }) => x);
    const yy = pixelDiff.map(({ y }) => y);
    const zone = {
        xMin: Math.min(...xx),
        xMax: Math.max(...xx),
        yMin: Math.min(...yy),
        yMax: Math.max(...yy),
    };
    console.log('zone', zone);
    drawRect(zone.xMin, zone.yMin, zone.xMax - zone.xMin, zone.yMax - zone.yMin, width, output);
}

function drawRect(x: number, y: number, w: number, h: number, width: number, output: Buffer) {
    const topLeft = { x, y };
    const topRight = { x: x + w - 1, y };
    const bottomRight = { x: topRight.x, y: y + h - 1 };
    const bottomLeft = { x, y: bottomRight.y };

    drawLine(topLeft.x, topLeft.y, topRight.x, topRight.y, width, output);
    drawLine(topRight.x, topRight.y, bottomRight.x, bottomRight.y, width, output);
    drawLine(bottomRight.x, bottomRight.y, bottomLeft.x, bottomLeft.y, width, output);
    drawLine(bottomLeft.x, bottomLeft.y, topLeft.x, topLeft.y, width, output);
}

function drawLine(x0: number, y0: number, x1: number, y1: number, width: number, output: Buffer) {
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = (x0 < x1) ? 1 : -1;
    const sy = (y0 < y1) ? 1 : -1;
    let err = dx - dy;

    while (true) {

        const pos = (y0 * width + x0) * 4;

        drawPixel(output, pos, 250, 250, 0);

        if ((x0 === x1) && (y0 === y1)) {
            break;
        }

        const e2 = 2 * err;
        if (e2 > -dy) { err -= dy; x0 += sx; }
        if (e2 < dx) { err += dx; y0 += sy; }
    }
}
