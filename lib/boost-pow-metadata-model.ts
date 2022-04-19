import * as bsv from './bsv/index'
import { BoostUtils } from './boost-utils'
import { UInt32Little } from './fields/uint32Little'
import { UInt32Big } from './fields/uint32Big'
import { UInt64Big } from './fields/uint64Big'
import { Digest32 } from './fields/digest32'
import { Digest20 } from './fields/digest20'
import { Bytes } from './fields/bytes'

export class BoostPowMetadataModel {

    private constructor(
        private Tag: Bytes,
        private MinerPubKeyHash: Digest20,
        private ExtraNonce1: UInt32Big,
        private ExtraNonce2: UInt64Big,
        private UserNonce: UInt32Little,
        private AdditionalData: Bytes
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
            new Bytes(Buffer.from(params.tag, 'hex')),
            new Digest20(BoostUtils.createBufferAndPad(params.minerPubKeyHash, 20, false)),
            new UInt32Big(BoostUtils.createBufferAndPad(params.extraNonce1, 4, false)),
            new UInt64Big(BoostUtils.createBufferAndPad(params.extraNonce2, 8, false)),
            new UInt32Little(BoostUtils.createBufferAndPad(params.userNonce, 4, false)),
            new Bytes(Buffer.from(params.additionalData, 'hex')),
        )
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
            new Bytes(params.tag),
            new Digest20(params.minerPubKeyHash),
            new UInt32Big(params.extraNonce1),
            new UInt64Big(params.extraNonce2),
            new UInt32Little(params.userNonce),
            new Bytes(params.additionalData),
        )
    }

    get tag(): Bytes {
        return this.Tag
    }

    get minerPubKeyHash(): Digest20 {
        return this.MinerPubKeyHash
    }

    get userNonce(): UInt32Little {
        return this.UserNonce
    }

    get extraNonce1(): UInt32Big {
        return this.ExtraNonce1
    }

    get extraNonce2(): UInt64Big {
        return this.ExtraNonce2
    }

    get additionalData(): Bytes {
        return this.AdditionalData
    }

    get getCoinbaseString() {
        return this.toString()
    }

    get hash(): Digest32 {
        return new Digest32(bsv.crypto.Hash.sha256sha256(this.toBuffer()))
    }

    toString(): string {
        return this.toBuffer().toString('hex')
    }

    toObject () {
        return {
            tag: this.Tag.hex,
            minerPubKeyHash: this.minerPubKeyHash.hex,
            extraNonce1: this.extraNonce1.hex,
            extraNonce2: this.extraNonce2.hex,
            userNonce: this.userNonce.hex,
            additionalData: this.additionalData.hex,
        }
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            this.tag.buffer,
            this.minerPubKeyHash.buffer,
            this.extraNonce1.buffer,
            this.extraNonce2.buffer,
            this.userNonce.buffer,
            this.additionalData.buffer
        ])
    }

    toHex(): string {
        return this.toBuffer().toString('hex')
    }

}
