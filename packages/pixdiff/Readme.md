# Pixdiff

Pixdiff is an image comparison that detect pixel difference between 2 images. This library is heavely inspired by [pixelmatch](https://github.com/mapbox/pixelmatch). 90% of the code is coming from this library converted to Typescript. Also some new feature was added to determine some differences in the images by zones instead of pixel. See the example, the red pixel are the pixel differences, the yellow pixel the anti aliasing and the green rectangle the zone.

![screenshot-example](https://github.com/apiel/test-crawler/blob/master/packages/pixdiff/screenshot-example.jpeg?raw=true)

```
import { pixdiff } from 'pixdiff';
import { readFile, writeFile } from 'fs-extra';

async function diffPng() {
    const actual = await readFile('img1.png');
    const expected = await readFile('img2.png');
    const rawActual = PNG.sync.read(actual);
    const rawExpected = PNG.sync.read(expected);

    const { width, height } = rawActual;
    const diffImage = new PNG({ width, height });

    const { diff, zones } = pixdiff(
        rawActual,
        rawExpected,
        diffImage,
    );

    if (diff) {
        const buffer = PNG.sync.write(diffImage, { colorType: 6 });
        writeFile('diff.png', buffer);
    }
}
diffPng();
```