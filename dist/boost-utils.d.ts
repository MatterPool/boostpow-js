/// <reference types="node" />
import * as bsv from 'bsv';
export declare class BoostUtils {
    static getSha256(str: any, encoding?: 'utf8' | 'hex'): any;
    static writeInt32LE(x: number): Buffer;
    static writeUInt32LE(x: number): Buffer;
    static trimBufferString(str: Buffer, trimTrailingNulls?: boolean): string;
    static maxBits(): number;
    static minBits(): number;
    static unitBits(): number;
    /**
     * Returns the target difficulty for this block
     * @param {Number} bits
     * @returns {BN} An instance of BN with the decoded difficulty bits
     */
    static getTargetDifficulty(bits: number): bsv.crypto.BN;
    /**
     * @link https://en.bitcoin.it/wiki/Difficulty
     * @return {Number}
     */
    static difficulty(bits: number): number;
    static difficulty2bits(difficulty: number): number;
    static getTargetAsNumberBuffer(diff: any): any;
    static stringToBuffer(str: string, length?: number): Buffer;
    static generalPurposeBitsMask(): number;
    static createBufferAndPad(buf: any, length: number, reverse?: boolean): any;
}
