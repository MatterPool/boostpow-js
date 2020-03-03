export declare class BoostHeaderModel {
    private _blockheader;
    private constructor();
    hash(): string;
    validProofOfWork(): boolean;
    static fromBuffer(buf: any): BoostHeaderModel;
    static fromString(str: any): BoostHeaderModel;
    static fromObject(obj: any): BoostHeaderModel;
    toBuffer(): any;
    toString(): any;
    toObject(): {
        hash: any;
        content: any;
        bits: any;
        version: any;
        abstract: any;
        time: any;
        nonce: any;
    };
}
