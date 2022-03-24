/// <reference types="node" />
import * as bsv from 'bsv';
export declare class Digest32 {
    private data;
    constructor(data: Buffer);
    static fromHex(x: string): Digest32;
    get hex(): string;
    get number(): bsv.crypto.BN;
    get buffer(): Buffer;
    get string(): string;
    get utf8(): string;
}
