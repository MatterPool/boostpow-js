/// <reference types="node" />
export declare class UInt32Little {
    private data;
    constructor(data: Buffer);
    static fromNumber(num: number): UInt32Little;
    hex(): string;
    number(): number;
    buffer(): Buffer;
    string(): string;
}
