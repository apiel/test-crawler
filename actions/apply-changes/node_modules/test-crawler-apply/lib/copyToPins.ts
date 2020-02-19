import { readJson, writeFileAsync, copyFileAsync } from './utils';

export interface CopyToPinsProps {
    srcBase: string, // full path of src include id, without extension
    dstBase: string, // full path of dst include id, without extension
}
export interface CopyToPins {
    type: 'copyToPins';
    props: CopyToPinsProps;
}
export async function copyToPins({
    srcBase,
    dstBase,
}: CopyToPinsProps): Promise<any> {
    // Remove all diff, to be able to use them for the always pin zone feature
    const data = await readJson(`${srcBase}.json`);
    if (data?.png) {
        data.png.diff = {
            pixelDiffRatio: 0,
            zones: [],
        };
        if (data.png.diff.pixelDiffRatio > 0) {
            await writeFileAsync(`${srcBase}.json`, JSON.stringify(data, null, 4));
        }
    }

    await writeFileAsync(`${dstBase}.json`, JSON.stringify(data, null, 4));
    await copyFileAsync(`${srcBase}.html`, `${dstBase}.html`);
    await copyFileAsync(`${srcBase}.png`, `${dstBase}.png`);

    return data;
}
