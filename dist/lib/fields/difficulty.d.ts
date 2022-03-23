/// <reference types="node" />
import * as bsv from 'bsv';
export declare class Difficulty {
    private diff;
    constructor(diff: number);
    static fromBits(bits: number): Difficulty;
    get number(): number;
    get bits(): number;
    get buffer(): Buffer;
    get hex(): string;
    get string(): string;
    get target(): bsv.crypto.BN;
}
