/// <reference types="node" />
export declare class Digest20 {
    private data;
    constructor(data: Buffer);
    get hex(): string;
    get buffer(): Buffer;
    get string(): string;
    get utf8(): string;
}
