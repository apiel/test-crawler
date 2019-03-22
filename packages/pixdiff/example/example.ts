import { PNG } from 'pngjs';
import { readFile, writeFile } from 'fs-extra';

import { pixelmatch } from '../src';

async function parsePng(lastFile: string, previousFile: string) {
    const actual = await readFile(lastFile);
    const expected = await readFile(previousFile);
    const rawActual = PNG.sync.read(actual);
    const rawExpected = PNG.sync.read(expected);

    const { width, height } = rawActual;
    const diffImage = new PNG({ width, height });

    const { diff, zones } = pixelmatch(
        rawActual,
        rawExpected,
        diffImage,
    );

    const totalPixels = width * height;
    const diffRatio = diff / totalPixels;
    console.log('PNG', `diff ratio: ${diffRatio}`);
    console.log('PNG', 'zone', zones);

    if (diffRatio) {
        const buffer = PNG.sync.write(diffImage, { colorType: 6 });
        const diffFile = `${__dirname}/diff.png`;
        writeFile(diffFile, buffer);
    }
}

parsePng(
    `${__dirname}/a.png`,
    `${__dirname}/b.png`,
);
