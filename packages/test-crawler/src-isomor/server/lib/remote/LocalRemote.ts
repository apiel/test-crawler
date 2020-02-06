import { Remote } from './Remote';
import {
    readJSON,
    readFile,
    readdir,
    mkdirp,
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

    protected getPath(path: string) {
        return join(PROJECT_FOLDER, this.projectId, path);
    }
}
