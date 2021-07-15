import * as bsv from 'bsv';
import { BoostUtils } from './boost-utils';
import { UInt32Little } from './fields/uint32Little';

export class BoostPowMetadataModel {

    private constructor(
        private tag: Buffer,
        private minerPubKeyHash: Buffer,
        private extraNonce1: Buffer,
        private extraNonce2: Buffer,
        private UserNonce: UInt32Little,
        private additionalData: Buffer
    ) {
    }

    static fromObject(params: {
        tag: string,
        minerPubKeyHash: string,
        extraNonce1: string,
        extraNonce2: string,
        userNonce: string,
        additionalData: string
    }): BoostPowMetadataModel {

        return new BoostPowMetadataModel(
            new Buffer(params.tag, 'hex'),
            BoostUtils.createBufferAndPad(params.minerPubKeyHash, 20, false),
            BoostUtils.createBufferAndPad(params.extraNonce1, 4, false),
            BoostUtils.createBufferAndPad(params.extraNonce2, 8, false),
            new UInt32Little(BoostUtils.createBufferAndPad(params.userNonce, 4, false)),
            new Buffer(params.additionalData, 'hex'),
        );
    }

    static fromBuffer(params: {
        tag: Buffer,
        minerPubKeyHash: Buffer,
        extraNonce1: Buffer,
        extraNonce2: Buffer,
        userNonce: Buffer,
        additionalData: Buffer
    }): BoostPowMetadataModel {

        return new BoostPowMetadataModel(
            params.tag,
            params.minerPubKeyHash,
            params.extraNonce1,
            params.extraNonce2,
            new UInt32Little(params.userNonce),
            params.additionalData,
        );
    }

    getTag(): Buffer {
        return this.tag;
    }

    getTagUtf8(): string {
        return BoostUtils.trimBufferString(this.tag, true);
    }

    getTagString(): string {
        return this.getTagUtf8();
    }

    getMinerPubKeyHash(): Buffer {
        return this.minerPubKeyHash;
    }

    getMinerPubKeyHashUtf8(): string {
        return this.minerPubKeyHash.toString('hex');
    }

    userNonce(): UInt32Little {
        return this.UserNonce;
    }

    getExtraNonce1Number(): number {
        return parseInt(this.extraNonce1.toString('hex'), 16);
    }

    getExtraNonce1(): Buffer {
        return this.extraNonce1;
    }

    getExtraNonce2Number(): number {
        return parseInt(this.extraNonce2.toString('hex'), 16);
    }

    getExtraNonce2(): Buffer {
        return this.extraNonce2;
    }

    getAdditionalData(): Buffer {
        return this.additionalData;
    }

    getAdditionalDataUtf8(): string {
        return BoostUtils.trimBufferString(this.additionalData, true);
    }

    getAdditionalDataString(): string {
        return this.getAdditionalDataUtf8();
    }

    toString(): string {
        return this.toBuffer().toString('hex');
    }

    getCoinbaseString() {
        return this.toString();
    }

    hash() {
        return bsv.crypto.Hash.sha256sha256(this.toBuffer()).reverse().toString('hex');
    }

    hashAsBuffer() {
        return bsv.crypto.Hash.sha256sha256(this.toBuffer());
    }

    toObject () {
        return {
            tag: this.tag.toString('hex'),
            minerPubKeyHash: this.minerPubKeyHash.toString('hex'),
            extraNonce1: this.extraNonce1.toString('hex'),
            extraNonce2: this.extraNonce2.toString('hex'),
            userNonce: this.UserNonce.hex(),
            additionalData: this.additionalData.toString('hex'),
        };
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            this.tag,
            this.minerPubKeyHash,
            this.extraNonce1,
            this.extraNonce2,
            this.UserNonce.buffer(),
            this.additionalData
        ]);
    }

    toHex(): string {
        return this.toBuffer().toString('hex');
    }

}
