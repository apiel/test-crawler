import { Remote } from './Remote';
import {
    readJSON,
    readFile,
} from 'fs-extra';
import { join } from 'path';
import { PROJECT_FOLDER } from '../config';

export class LocalRemote extends Remote {
    read(projectId: string, path: string) {
        return readFile(join(PROJECT_FOLDER, projectId, path));
    }

    readJSON(projectId: string, path: string) {
        return readJSON(join(PROJECT_FOLDER, projectId, path));
    }
}
