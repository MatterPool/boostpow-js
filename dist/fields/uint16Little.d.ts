/// <reference types="node" />
export declare class UInt16Little {
    private data;
    constructor(data: Buffer);
    static fromNumber(num: number): UInt16Little;
    get hex(): string;
    get number(): number;
    get buffer(): Buffer;
    get string(): string;
}
