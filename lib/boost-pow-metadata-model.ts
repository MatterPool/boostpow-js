import * as bsv from 'bsv';
import { BoostUtils } from './boost-utils';

export class BoostPowMetadataModel {

    private constructor(
        private tag: Buffer,
        private minerPubKeyHash: Buffer,
        private extraNonce1: Buffer,
        private extraNonce2: Buffer,
        private userNonce: Buffer,
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
            BoostUtils.createBufferAndPad(params.userNonce, 4, false),
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
            params.userNonce,
            params.additionalData,
        );
    }
    public trimBufferString(str: string, trimLeadingNulls = true): string {
        const content = Buffer.from(str, 'hex').toString('utf8');
        if (trimLeadingNulls) {
            return content.replace(/\0/g, '');
        } else {
            return content;
        }
    }

    getTag(): Buffer {
        return this.tag;
    }

    getTagUtf8(): string {
        return this.trimBufferString(Buffer.from(this.tag).reverse().toString('hex'), true);
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

    getUserNonce(): Buffer {
        return this.userNonce;
    }

    getUserNonceUtf8(): string {
        return this.trimBufferString(Buffer.from(this.userNonce).reverse().toString('hex'), true);
    }

    getUserNonceNumber(): number {
        return this.userNonce.readUInt32LE();
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
        return this.trimBufferString(Buffer.from(this.additionalData).reverse().toString('hex'), true);
    }

    getAdditionalDataString(): string {
        return this.getAdditionalDataUtf8();
    }

    toString() {
        return Buffer.concat([
            this.tag,
            this.minerPubKeyHash,
            this.extraNonce1,
            this.extraNonce2,
            this.userNonce,
            this.additionalData
        ]).toString('hex');
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
            userNonce: this.userNonce.toString('hex'),
            additionalData: this.additionalData.toString('hex'),
        };
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            this.tag,
            this.minerPubKeyHash,
            this.extraNonce1,
            this.extraNonce2,
            this.userNonce,
            this.additionalData
        ]);
    }

    toHex(): string {
        return this.toBuffer().toString('hex');
    }

}
