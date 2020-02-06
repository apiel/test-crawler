export abstract class Remote {
    abstract read(projectId: string, path: string): Promise<Buffer>;
    abstract readJSON(projectId: string, path: string): Promise<any>;
}
