/// <reference types="node" />
export declare class Int32Little {
    private data;
    constructor(data: Buffer);
    static fromNumber(num: number): Int32Little;
    hex(): string;
    number(): number;
    buffer(): Buffer;
    string(): string;
    utf8(): string;
}
