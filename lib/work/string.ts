import * as bsv from '../bsv'
import { Int32Little } from '../fields/int32Little'
import { UInt32Little } from '../fields/uint32Little'
import { UInt16Little } from '../fields/uint16Little'
import { Digest32 } from '../fields/digest32'
import { BoostUtils } from '../boost-utils'

export class PowString {
    private _blockheader

    constructor(blockheader: bsv.BlockHeader) {
        this._blockheader = blockheader
    }

    // Use boosthash(), hash() and id() to all be equal to the string
    // remember, the string itself is the data and proof of work identity.
    get boostHash(): Digest32 {
        return this.hash
    }

    get hash(): Digest32 {
        return Digest32.fromHex(this._blockheader.hash)
    }

    get id(): Digest32 {
        return this.hash
    }

    get category(): Int32Little {
      return Int32Little.fromNumber(this._blockheader.version)
    }

    get magicNumber(): UInt16Little {
      return UInt16Little.fromNumber(BoostUtils.magicNumber(this.category.number))
    }

    get content(): Digest32 {
        return new Digest32(Buffer.from(this.toObject().content, 'hex').reverse())
    }

    get bits(): UInt32Little {
        return UInt32Little.fromNumber(this._blockheader.toObject().bits)
    }

    get metadataHash(): Digest32 {
        return new Digest32(Buffer.from(this.toObject().metadataHash, 'hex').reverse())
    }

    get nonce(): UInt32Little {
        return UInt32Little.fromNumber(this._blockheader.nonce)
    }

    get time(): UInt32Little {
        return UInt32Little.fromNumber(this._blockheader.time)
    }

    valid(): boolean {
      return this._blockheader.validProofOfWork()
    }

    static fromBuffer (buf): PowString {
        return new PowString(bsv.BlockHeader.fromBuffer(buf))
    }

    static fromString(str): PowString {
        var buf = Buffer.from(str, 'hex')
        return new PowString(bsv.BlockHeader.fromBuffer(buf))
    }

    static fromHex(str): PowString {
        var buf = Buffer.from(str, 'hex')
        return new PowString(bsv.BlockHeader.fromBuffer(buf))
    }

    static fromObject(obj): PowString {
        const spoofedObj = {
            prevHash: obj.content,
            bits: obj.bits,
            version: obj.category,
            merkleRoot: obj.metadataHash,
            time: obj.time,
            nonce: obj.nonce,
        }
        return new PowString(bsv.BlockHeader.fromObject(spoofedObj))
    }

    toBuffer () {
        return this._blockheader.toBufferWriter().concat()
    }

    toString () {
        return this._blockheader.toBuffer().toString('hex')
    }

    toHex () {
        return this._blockheader.toBuffer().toString('hex')
    }

    toObject () {
        const blockheaderObj = this._blockheader.toObject()
        const boostheaderObj = {
            hash: blockheaderObj.hash,
            content: blockheaderObj.prevHash,
            bits: blockheaderObj.bits,
            difficulty: this.difficulty,
            category: blockheaderObj.version,
            metadataHash: blockheaderObj.merkleRoot,
            time: blockheaderObj.time,
            nonce: blockheaderObj.nonce,
        }

        return boostheaderObj
    }

    get difficulty() : number {
        return this._blockheader.getDifficulty()
    }

}
