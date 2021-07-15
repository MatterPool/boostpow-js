/// <reference types="node" />
export declare class UInt32Big {
    private data;
    constructor(data: Buffer);
    static fromNumber(num: number): UInt32Big;
    hex(): string;
    number(): number;
    buffer(): Buffer;
    string(): string;
    utf8(): string;
}
