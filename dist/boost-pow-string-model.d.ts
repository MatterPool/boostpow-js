import * as bsv from 'bsv';
export declare class BoostPowStringModel {
    private _blockheader;
    constructor(blockheader: bsv.BlockHeader);
    boosthash(): string;
    hash(): string;
    id(): string;
    contentHex(): string;
    contentBuffer(): string;
    private trimBufferString;
    contentString(trimLeadingNulls?: boolean): string;
    bits(): number;
    metadataHash(): string;
    nonce(): number;
    time(): number;
    category(): number;
    static validProofOfWorkFromBuffer(buf: any): boolean;
    static validProofOfWorkFromString(str: any): boolean;
    static validProofOfWorkFromObject(obj: any): boolean;
    static fromBuffer(buf: any): BoostPowStringModel;
    static fromString(str: any): BoostPowStringModel;
    static fromHex(str: any): BoostPowStringModel;
    static fromObject(obj: any): BoostPowStringModel;
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
    difficulty(): number;
    targetDifficulty(bits?: number): any;
}
