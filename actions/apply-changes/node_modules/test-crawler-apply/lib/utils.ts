import { promisify } from 'util';
import { readFile, writeFile, copyFile } from 'fs';

export const writeFileAsync = promisify(writeFile);
export const copyFileAsync = promisify(copyFile);

const readFileAsync = promisify(readFile);

export async function readJson(file: string) {
    const content = await readFileAsync(file);
    return JSON.parse(content.toString());
}
