/// <reference types="node" />
export declare class UInt64Big {
    private data;
    constructor(data: Buffer);
    get hex(): string;
    get buffer(): Buffer;
    get string(): string;
    get utf8(): string;
}
