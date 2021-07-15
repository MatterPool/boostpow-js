import * as bsv from 'bsv';
import { BoostUtils } from './boost-utils';
import { UInt32Little } from './fields/uint32Little';
import { UInt32Big } from './fields/uint32Big';
import { UInt64Big } from './fields/uint64Big';
import { Digest32 } from './fields/digest32';
import { Digest20 } from './fields/digest20';

export class BoostPowMetadataModel {

    private constructor(
        private tag: Buffer,
        private MinerPubKeyHash: Digest20,
        private ExtraNonce1: UInt32Big,
        private ExtraNonce2: UInt64Big,
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
            new Digest20(BoostUtils.createBufferAndPad(params.minerPubKeyHash, 20, false)),
            new UInt32Big(BoostUtils.createBufferAndPad(params.extraNonce1, 4, false)),
            new UInt64Big(BoostUtils.createBufferAndPad(params.extraNonce2, 8, false)),
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
            new Digest20(params.minerPubKeyHash),
            new UInt32Big(params.extraNonce1),
            new UInt64Big(params.extraNonce2),
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

    minerPubKeyHash(): Digest20 {
        return this.MinerPubKeyHash;
    }

    userNonce(): UInt32Little {
        return this.UserNonce;
    }

    extraNonce1(): UInt32Big {
        return this.ExtraNonce1;
    }

    extraNonce2(): UInt64Big {
        return this.ExtraNonce2;
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

    hash(): Digest32 {
        return new Digest32(bsv.crypto.Hash.sha256sha256(this.toBuffer()));
    }

    toObject () {
        return {
            tag: this.tag.toString('hex'),
            minerPubKeyHash: this.MinerPubKeyHash.hex(),
            extraNonce1: this.ExtraNonce1.hex(),
            extraNonce2: this.ExtraNonce2.hex(),
            userNonce: this.UserNonce.hex(),
            additionalData: this.additionalData.toString('hex'),
        };
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            this.tag,
            this.MinerPubKeyHash.buffer(),
            this.ExtraNonce1.buffer(),
            this.ExtraNonce2.buffer(),
            this.UserNonce.buffer(),
            this.additionalData
        ]);
    }

    toHex(): string {
        return this.toBuffer().toString('hex');
    }

}
