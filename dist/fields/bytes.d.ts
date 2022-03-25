/// <reference types="node" />
import { Digest32 } from './digest32';
export declare class Bytes {
    private data;
    constructor(data: Buffer);
    get buffer(): Buffer;
    get hex(): string;
    get string(): string;
    get utf8(): string;
    get hash256(): Digest32;
}
