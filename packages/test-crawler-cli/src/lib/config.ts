import { join } from 'path';

export const ROOT_FOLDER =
    process.env.ROOT_FOLDER || join(__dirname, '../../..'); // this iswrong need to fix
