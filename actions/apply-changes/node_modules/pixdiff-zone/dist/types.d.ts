/// <reference types="node" />
export interface Options {
    threshold?: number;
    includeAntiAliasing?: boolean;
    drawPixelDiff?: boolean;
    drawZonesDiff?: boolean;
    zoneColor?: Color;
    antiAliasingColor?: Color;
    pixelDiffColor?: Color;
}
export interface Color {
    r: number;
    g: number;
    b: number;
}
export interface Zone {
    xMin: number;
    yMin: number;
    xMax: number;
    yMax: number;
}
export interface Image {
    data: Buffer;
    width: number;
    height: number;
}
