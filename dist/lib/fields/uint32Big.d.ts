/// <reference types="node" />
export declare class InvalidUInt32Big implements Error {
    name: string;
    message: string;
}
export declare class UInt32Big {
    private data;
    constructor(data: Buffer);
    static fromNumber(num: number): UInt32Big;
    static fromHex(hex: string): UInt32Big;
    get hex(): string;
    get number(): number;
    get buffer(): Buffer;
    get string(): string;
    get utf8(): string;
}
