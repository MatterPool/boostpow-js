/// <reference types="node" />
export declare class UInt32Big {
    private data;
    constructor(data: Buffer);
    static fromNumber(num: number): UInt32Big | undefined;
    static fromHex(hex: string): UInt32Big | undefined;
    get hex(): string;
    get number(): number;
    get buffer(): Buffer;
    get string(): string;
    get utf8(): string;
}
