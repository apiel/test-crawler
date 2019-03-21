import { info } from 'npmlog';
import { PNG } from 'pngjs';
import { readFile, writeFile } from 'fs-extra';

// import * as pixelmatch from 'pixelmatch';
// const pixelmatch = require('pixelmatch'); // tslint:disable-line

import { pixelmatch } from './pixeldiff';

async function parsePng(lastFile: string, previousFile: string) {
    const actual = await readFile(lastFile);
    const expected = await readFile(previousFile);
    const rawActual = PNG.sync.read(actual);
    const rawExpected = PNG.sync.read(expected);

    const { width, height } = rawActual;
    const diffImage = new PNG({ width, height });

    const diffPixelCount = pixelmatch(
        rawActual,
        rawExpected,
        diffImage,
    );

    const totalPixels = width * height;
    const diffRatio = diffPixelCount / totalPixels;
    info('PNG', `diff ratio: ${diffRatio}`);

    if (diffRatio) {
        const buffer = PNG.sync.write(diffImage, { colorType: 6 });
        const diffFile = `diff.png`;
        writeFile(diffFile, buffer);
    }
}

parsePng(
    './pages/1553030752/87a70ce46ea04de7c28dd1e4da31904c.png',
    './pages/1553030715/87a70ce46ea04de7c28dd1e4da31904c.png',
);
