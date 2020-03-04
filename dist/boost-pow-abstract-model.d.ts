/// <reference types="node" />
export declare class BoostPowAbstractModel {
    private tag;
    private minerAddress;
    private unique;
    private minerNonce;
    private metadata;
    private constructor();
    static fromObject(params: {
        tag: string;
        minerAddress: string;
        unique: string;
        minerNonce: string;
        metadata: string;
    }): BoostPowAbstractModel;
    static fromBuffer(params: {
        tag: Buffer;
        minerAddress: Buffer;
        unique: Buffer;
        minerNonce: Buffer;
        metadata: Buffer;
    }): BoostPowAbstractModel;
    getTag(): Buffer;
    getMinerAddress(): Buffer;
    getUnique(): Buffer;
    getMinerNonce(): Buffer;
    getMetadata(): Buffer;
    hash(): any;
    hashAsBuffer(): any;
    toObject(): {
        tag: string;
        minerAddress: string;
        unique: string;
        minerNonce: string;
        metadata: string;
    };
    toBuffer(): Buffer;
    toHex(): string;
    static fromHex(str: string): BoostPowAbstractModel | null;
}
