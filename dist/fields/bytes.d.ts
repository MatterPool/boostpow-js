/// <reference types="node" />
import { Digest32 } from './digest32';
export declare class Bytes {
    private data;
    constructor(data: Buffer);
    static fromHex(b: string): Bytes;
    get buffer(): Buffer;
    get hex(): string;
    get string(): string;
    get utf8(): string;
    get hash256(): Digest32;
    get length(): number;
}
