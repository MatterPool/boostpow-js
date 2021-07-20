/// <reference types="node" />
export declare class Digest32 {
    private data;
    constructor(data: Buffer);
    static fromHex(x: string): Digest32;
    get hex(): string;
    get number(): any;
    get buffer(): Buffer;
    get string(): string;
    get utf8(): string;
}
