/// <reference types="node" />
export declare class Digest20 {
    private data;
    constructor(data: Buffer);
    hex(): string;
    buffer(): Buffer;
    string(): string;
    utf8(): string;
}
