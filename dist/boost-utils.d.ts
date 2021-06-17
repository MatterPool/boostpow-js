/// <reference types="node" />
export declare class BoostUtils {
    static getSha256(str: any, encoding?: 'utf8' | 'hex'): any;
    static writeInt32LE(x: number): Buffer;
    static writeUInt32LE(x: number): Buffer;
    static difficulty2bits(difficulty: number): number;
    static getTargetAsNumberBuffer(diff: any): any;
    static stringToBuffer(str: string, length?: number): Buffer;
    static createBufferAndPad(buf: any, length: number, reverse?: boolean): any;
}
