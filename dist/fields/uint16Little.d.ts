/// <reference types="node" />
export declare class UInt16Little {
    private data;
    constructor(data: Buffer);
    static fromNumber(num: number): UInt16Little;
    hex(): string;
    number(): number;
    buffer(): Buffer;
    string(): string;
}
