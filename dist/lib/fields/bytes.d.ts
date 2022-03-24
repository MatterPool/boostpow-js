/// <reference types="node" />
export declare class Bytes {
    private data;
    constructor(data: Buffer);
    get buffer(): Buffer;
    get hex(): string;
    get string(): string;
    get utf8(): string;
}
