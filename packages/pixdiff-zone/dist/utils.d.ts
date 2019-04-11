import { Image, Color, Zone } from './types';
export declare function groupOverlappingZone(zones: Zone[]): Zone[];
export declare function zoneOverlap(zoneA: Zone, zoneB: Zone): boolean;
export declare function getDiffZone(pixelDiff: Array<{
    x: number;
    y: number;
}>): Zone[];
export declare function grayPixel(image: Image, i: number, alpha: number): number;
export declare function antialiased(img: Image, xMin: number, yMin: number, img2: Image): boolean;
export declare function hasManySiblings({ data, width, height }: Image, xMin: number, yMin: number): boolean;
export declare function colorDelta(img1: Image, img2: Image, k: number, m: number, yOnly?: boolean): number;
export declare function rgb2y({ r, g, b }: Color): number;
export declare function rgb2i({ r, g, b }: Color): number;
export declare function rgb2q({ r, g, b }: Color): number;
export declare function blend(c: number, a: number): number;
