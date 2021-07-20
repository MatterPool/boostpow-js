/// <reference types="node" />
export declare class UInt32Little {
    private data;
    constructor(data: Buffer);
    static fromNumber(num: number): UInt32Little;
    get hex(): string;
    get number(): number;
    get buffer(): Buffer;
    get string(): string;
    get utf8(): string;
}
