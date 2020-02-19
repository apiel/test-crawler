import { Image, Color, Options, Zone } from './types';
import { zoneOverlap, groupOverlappingZone } from './utils';
export { Image, Color, Options, Zone };
export { zoneOverlap, groupOverlappingZone };
export declare function pixdiff(img1: Image, img2: Image, output: Image, options?: Options): {
    diff: number;
    zones: Zone[];
};
export declare function drawPixel(image: Image, pos: number, { r, g, b }: Color): void;
export declare function drawZones(zones: Zone[], output: Image, color: Color): void;
export declare function drawZone(zone: Zone, output: Image, color: Color): void;
export declare function drawLine(x0: number, y0: number, x1: number, y1: number, output: Image, color: Color): void;
