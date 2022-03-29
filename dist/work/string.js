"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PowString = void 0;
const bsv = require("bsv");
const int32Little_1 = require("../fields/int32Little");
const uint32Little_1 = require("../fields/uint32Little");
const uint16Little_1 = require("../fields/uint16Little");
const digest32_1 = require("../fields/digest32");
const boost_utils_1 = require("../boost-utils");
class PowString {
    constructor(blockheader) {
        this._blockheader = blockheader;
        if (!this._blockheader.validProofOfWork()) {
            throw new Error('INVALID_POW');
        }
    }
    // Use boosthash(), hash() and id() to all be equal to the string
    // remember, the string itself is the data and proof of work identity.
    get boostHash() {
        return this.hash;
    }
    get hash() {
        return digest32_1.Digest32.fromHex(this._blockheader.hash);
    }
    get id() {
        return this.hash;
    }
    get category() {
        return int32Little_1.Int32Little.fromNumber(this._blockheader.version);
    }
    get magicNumber() {
        return uint16Little_1.UInt16Little.fromNumber(boost_utils_1.BoostUtils.magicNumber(this.category.number));
    }
    get content() {
        return new digest32_1.Digest32(new Buffer(this.toObject().content, 'hex').reverse());
    }
    get bits() {
        return uint32Little_1.UInt32Little.fromNumber(this._blockheader.toObject().bits);
    }
    get metadataHash() {
        return new digest32_1.Digest32(new Buffer(this.toObject().metadataHash, 'hex').reverse());
    }
    get nonce() {
        return uint32Little_1.UInt32Little.fromNumber(this._blockheader.nonce);
    }
    get time() {
        return uint32Little_1.UInt32Little.fromNumber(this._blockheader.time);
    }
    valid() {
        return this._blockheader.validProofOfWork();
    }
    static fromBuffer(buf) {
        return new String(bsv.BlockHeader.fromBuffer(buf));
    }
    static fromString(str) {
        var buf = Buffer.from(str, 'hex');
        return new String(bsv.BlockHeader.fromBuffer(buf));
    }
    static fromHex(str) {
        var buf = Buffer.from(str, 'hex');
        return new String(bsv.BlockHeader.fromBuffer(buf));
    }
    static fromObject(obj) {
        const spoofedObj = {
            prevHash: obj.content,
            bits: obj.bits,
            version: obj.category,
            merkleRoot: obj.metadataHash,
            time: obj.time,
            nonce: obj.nonce,
        };
        return new String(bsv.BlockHeader.fromObject(spoofedObj));
    }
    toBuffer() {
        return this._blockheader.toBufferWriter().concat();
    }
    toString() {
        return this._blockheader.toBuffer().toString('hex');
    }
    toHex() {
        return this._blockheader.toBuffer().toString('hex');
    }
    toObject() {
        const blockheaderObj = this._blockheader.toObject();
        const boostheaderObj = {
            hash: blockheaderObj.hash,
            content: blockheaderObj.prevHash,
            bits: blockheaderObj.bits,
            difficulty: this.difficulty,
            category: blockheaderObj.version,
            metadataHash: blockheaderObj.merkleRoot,
            time: blockheaderObj.time,
            nonce: blockheaderObj.nonce,
        };
        return boostheaderObj;
    }
    get difficulty() {
        return this._blockheader.getDifficulty();
    }
}
exports.PowString = PowString;
