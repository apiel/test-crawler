import { info } from 'logol';
import { dirname, join, basename } from 'path';
import { promisify } from 'util';
import * as os from 'os';
import * as fs from 'fs';

const move = promisify(fs.rename);
const mkdir = promisify(fs.mkdir);

export enum Platform {
    mac = 'darwin',
    linux = 'linux',
    win = 'win32',
}

export enum Arch {
    x64 = 'x64',
    x32 = 'x32',
}

export async function getGeckodriver(
    platform: Platform,
    arch: Arch = Arch.x64,
) {
    const pkgFolder = getGeckoFolder();
    mockFnOnce(os, 'platform', () => platform);
    mockFnOnce(os, 'arch', () => arch);
    mockFnOnce(fs, 'createWriteStream', (file: string) => {
        return fs.createWriteStream(join(pkgFolder, file));
    });

    require(join(pkgFolder, 'index.js'));

    return join(
        pkgFolder,
        platform === Platform.win ? 'geckodriver.exe' : 'geckodriver',
    );
}

export async function moveFile(dstFolder: string, driverFile: string) {
    await mkdir(dstFolder, { recursive: true });
    const dstFile = `${dstFolder}/${basename(driverFile)}`;
    await move(driverFile, dstFile);
    return dstFile;
}

function getGeckoFolder() {
    const name = 'geckodriver';
    const pkgFolder = dirname(require.resolve(name));
    return join(pkgFolder, '..');
}

function mockFnOnce(module: any, name: string, ret: any) {
    const restore = module[name];
    module[name] = (...args: any[]) => {
        module[name] = restore;
        return ret(...args);
    };
}
