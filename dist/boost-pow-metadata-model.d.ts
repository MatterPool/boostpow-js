/// <reference types="node" />
export declare class BoostPowMetadataModel {
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
    }): BoostPowMetadataModel;
    static fromBuffer(params: {
        tag: Buffer;
        minerAddress: Buffer;
        unique: Buffer;
        minerNonce: Buffer;
        metadata: Buffer;
    }): BoostPowMetadataModel;
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
    static fromHex(str: string): BoostPowMetadataModel | null;
}
