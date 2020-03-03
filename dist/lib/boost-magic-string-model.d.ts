export declare class BoostMagicStringModel {
    private _boostheader;
    private constructor();
    hash(): string;
    static validProofOfWorkFromBuffer(buf: any): boolean;
    static validProofOfWorkFromString(str: any): boolean;
    static validProofOfWorkFromObject(obj: any): boolean;
    static fromBuffer(buf: any): BoostMagicStringModel;
    static fromString(str: any): BoostMagicStringModel;
    static fromObject(obj: any): BoostMagicStringModel;
    toBuffer(): any;
    toString(): any;
    toObject(): any;
}
