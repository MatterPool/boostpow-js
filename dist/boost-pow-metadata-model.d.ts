/// <reference types="node" />
import { UInt32Little } from './fields/uint32Little';
import { UInt32Big } from './fields/uint32Big';
import { UInt64Big } from './fields/uint64Big';
import { Digest32 } from './fields/digest32';
import { Digest20 } from './fields/digest20';
export declare class BoostPowMetadataModel {
    private tag;
    private MinerPubKeyHash;
    private ExtraNonce1;
    private ExtraNonce2;
    private UserNonce;
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
    getTagUtf8(): string;
    getTagString(): string;
    minerPubKeyHash(): Digest20;
    userNonce(): UInt32Little;
    extraNonce1(): UInt32Big;
    extraNonce2(): UInt64Big;
    getAdditionalData(): Buffer;
    getAdditionalDataUtf8(): string;
    getAdditionalDataString(): string;
    toString(): string;
    getCoinbaseString(): string;
    hash(): Digest32;
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
