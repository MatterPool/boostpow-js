/// <reference types="node" />
export declare class Int32Little {
    private data;
    constructor(data: Buffer);
    static fromNumber(num: number): Int32Little;
    static fromHex(hex: string): Int32Little | undefined;
    get buffer(): Buffer;
    get hex(): string;
    get number(): number;
    get string(): string;
    get utf8(): string;
}
