/// <reference types="node" />
export declare class UInt64Big {
    private data;
    constructor(data: Buffer);
    hex(): string;
    buffer(): Buffer;
    string(): string;
    utf8(): string;
}
