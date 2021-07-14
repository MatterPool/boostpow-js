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
    trimBufferString(str: string, trimLeadingNulls?: boolean): string;
    getTag(): Buffer;
    getTagUtf8(): string;
    getTagString(): string;
    getMinerPubKeyHash(): Buffer;
    getMinerPubKeyHashUtf8(): string;
    getUserNonce(): Buffer;
    getUserNonceUtf8(): string;
    getUserNonceNumber(): number;
    getExtraNonce1Number(): number;
    getExtraNonce1(): Buffer;
    getExtraNonce2Number(): number;
    getExtraNonce2(): Buffer;
    getAdditionalData(): Buffer;
    getAdditionalDataUtf8(): string;
    getAdditionalDataString(): string;
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
}
