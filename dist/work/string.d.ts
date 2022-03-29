import * as bsv from 'bsv';
import { Int32Little } from '../fields/int32Little';
import { UInt32Little } from '../fields/uint32Little';
import { UInt16Little } from '../fields/uint16Little';
import { Digest32 } from '../fields/digest32';
export declare class PowString {
    private _blockheader;
    constructor(blockheader: bsv.BlockHeader);
    get boostHash(): Digest32;
    get hash(): Digest32;
    get id(): Digest32;
    get category(): Int32Little;
    get magicNumber(): UInt16Little;
    get content(): Digest32;
    get bits(): UInt32Little;
    get metadataHash(): Digest32;
    get nonce(): UInt32Little;
    get time(): UInt32Little;
    valid(): boolean;
    static fromBuffer(buf: any): String;
    static fromString(str: any): String;
    static fromHex(str: any): String;
    static fromObject(obj: any): String;
    toBuffer(): any;
    toString(): any;
    toHex(): any;
    toObject(): {
        hash: any;
        content: any;
        bits: any;
        difficulty: number;
        category: any;
        metadataHash: any;
        time: any;
        nonce: any;
    };
    get difficulty(): number;
}
