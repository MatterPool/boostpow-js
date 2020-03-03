export declare class BoostPowMagicStringModel {
    private _boostheader;
    private constructor();
    hash(): string;
    validProofOfWork(): boolean;
    static fromBuffer(buf: any): BoostPowMagicStringModel;
    static fromString(str: any): BoostPowMagicStringModel;
    static fromObject(obj: any): BoostPowMagicStringModel;
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
