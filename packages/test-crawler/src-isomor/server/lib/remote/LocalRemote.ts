import { Remote } from './Remote';
import {
    readJSON,
    readFile,
    readdir,
    mkdirp,
    outputJSON,
    copy,
    pathExists,
    remove,
} from 'fs-extra';
import { join } from 'path';
import { PROJECT_FOLDER } from '../config';

export class LocalRemote extends Remote {
    constructor(private projectId: string) {
        super();
    }

    async readdir(path: string) {
        const fullpath = this.getPath(path);
        await mkdirp(fullpath);
        return readdir(fullpath);
    }

    read(path: string) {
        return readFile(this.getPath(path));
    }

    readJSON(path: string) {
        return readJSON(this.getPath(path));
    }

    saveJSON(file: string, data: any) {
        return outputJSON(this.getPath(file), data, { spaces: 4 });
    }

    async copy(src: string, dst: string) {
        const srcFile = this.getPath(src);
        if (await pathExists(srcFile)) {
            return copy(srcFile, this.getPath(dst), { overwrite: true });
        }
    }

    remove(file: string) {
        return remove(this.getPath(file));
    }

    protected getPath(path: string) {
        return join(PROJECT_FOLDER, this.projectId, path);
    }
}