import { info } from 'logol';
import { dirname, join } from 'path';
import * as os from 'os';
import * as fs from 'fs';

export enum Platform {
    mac = 'darwin',
    linux = 'linux',
    win = 'win32',
}

export enum Arch {
    x64 = 'x64',
    x32 = 'x32',
}

export async function getGeckodriver(platform: Platform, arch: Arch = Arch.x64) {
    const pkgFolder = getGeckoFolder();
    mockFnOnce(os, 'platform', () => platform);
    mockFnOnce(os, 'arch', () => arch);
    mockFnOnce(fs, 'createWriteStream', (file: string) => {
        return fs.createWriteStream(join(pkgFolder, file));
    });

    require(join(pkgFolder, 'index.js'))
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
