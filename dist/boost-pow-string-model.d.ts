export declare class BoostPowStringModel {
    private _blockheader;
    private constructor();
    hash(): string;
    static validProofOfWorkFromBuffer(buf: any): boolean;
    static validProofOfWorkFromString(str: any): boolean;
    static validProofOfWorkFromObject(obj: any): boolean;
    static fromBuffer(buf: any): BoostPowStringModel;
    static fromString(str: any): BoostPowStringModel;
    static fromObject(obj: any): BoostPowStringModel;
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
    getDifficulty(): any;
    getTargetDifficulty(bits?: number): any;
}
