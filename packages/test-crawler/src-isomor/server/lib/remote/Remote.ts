export abstract class Remote {
    abstract read(path: string): Promise<Buffer>;
    abstract readJSON(path: string): Promise<any>;
    abstract readdir(path: string): Promise<string[]>;
}
