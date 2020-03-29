/// <reference types="node" />
export declare class BoostPowMetadataModel {
    private tag;
    private minerPubKeyHash;
    private extraNonce1;
    private extraNonce2;
    private userNonce;
    private additionalData;
    private constructor();
    static fromObject(params: {
        tag: string;
        minerPubKeyHash: string;
        extraNonce1: string;
        extraNonce2: string;
        userNonce: string;
        additionalData: string;
    }): BoostPowMetadataModel;
    static fromBuffer(params: {
        tag: Buffer;
        minerPubKeyHash: Buffer;
        extraNonce1: Buffer;
        extraNonce2: Buffer;
        userNonce: Buffer;
        additionalData: Buffer;
    }): BoostPowMetadataModel;
    getTag(): Buffer;
    getMinerPubKeyHash(): Buffer;
    getUserNonce(): Buffer;
    getExtraNonce1(): Buffer;
    getExtraNonce2(): Buffer;
    getAdditionalData(): Buffer;
    toString(): string;
    getCoinbaseString(): string;
    hash(): any;
    hashAsBuffer(): any;
    toObject(): {
        tag: string;
        minerPubKeyHash: string;
        extraNonce1: string;
        extraNonce2: string;
        userNonce: string;
        additionalData: string;
    };
    toBuffer(): Buffer;
    toHex(): string;
    static fromHex(str: string): BoostPowMetadataModel | null;
}
