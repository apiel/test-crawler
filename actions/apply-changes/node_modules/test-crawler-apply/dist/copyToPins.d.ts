export interface CopyToPinsProps {
    srcBase: string;
    dstBase: string;
}
export interface CopyToPins {
    type: 'copyToPins';
    props: CopyToPinsProps;
}
export declare function copyToPins({ srcBase, dstBase, }: CopyToPinsProps): Promise<any>;
