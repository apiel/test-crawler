import { info } from 'logol';
// import { spawn } from 'child_process';
import { dirname, join } from 'path';
import * as os from 'os';
import * as fs from 'fs';

// function exec(cmd: string) {
//     return new Promise((resolve, reject) => {
//         const child = spawn(cmd, { stdio: 'inherit', shell: true });
//         child.on('close', resolve);
//         child.on('exit', resolve);
//         child.on('error', reject);
//     });
// }

// darwin
// win32
// linux

// x64
// x32

export async function getGeckodriver(platform: string, arch: string) {
    const name = 'geckodriver';
    const pkgFolder = dirname(require.resolve(name));
    // await exec(`node ${join(pkgFolder, 'install.js')}`);

    mockFnOnce(os, 'platform', () => platform);
    mockFnOnce(os, 'arch', () => arch);
    mockFnOnce(fs, 'createWriteStream', (file: string) => {
        return fs.createWriteStream(join(pkgFolder, '..', file));
    });

    // const restoreCreateWriteStream = fs.createWriteStream;
    // (fs as any).createWriteStream = (file: string) => {
    //     (fs as any).createWriteStream = restoreCreateWriteStream;
    //     return restoreCreateWriteStream(join(pkgFolder, '..', file));
    // };

    require(join(pkgFolder, '..', 'index.js'))
}

function mockFnOnce(module: any, name: string, ret: any) {
    const restore = module[name];
    module[name] = (...args: any[]) => {
        module[name] = restore;
        return ret(...args);
    };
}
