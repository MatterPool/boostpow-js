/// <reference types="node" />
export declare class Digest32 {
    private data;
    constructor(data: Buffer);
    static fromHex(x: string): Digest32;
    hex(): string;
    number(): any;
    buffer(): Buffer;
    string(): string;
    utf8(): string;
}
