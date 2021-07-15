/// <reference types="node" />
import { UInt32Little } from './fields/uint32Little';
import { UInt32Big } from './fields/uint32Big';
import { UInt64Big } from './fields/uint64Big';
import { Digest32 } from './fields/digest32';
import { Digest20 } from './fields/digest20';
import { Bytes } from './fields/bytes';
export declare class BoostPowMetadataModel {
    private Tag;
    private MinerPubKeyHash;
    private ExtraNonce1;
    private ExtraNonce2;
    private UserNonce;
    private AdditionalData;
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
    tag(): Bytes;
    minerPubKeyHash(): Digest20;
    userNonce(): UInt32Little;
    extraNonce1(): UInt32Big;
    extraNonce2(): UInt64Big;
    additionalData(): Bytes;
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
