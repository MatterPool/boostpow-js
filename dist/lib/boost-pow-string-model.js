"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoostPowStringModel = void 0;
const bsv = require("bsv");
const int32Little_1 = require("./fields/int32Little");
const uint32Little_1 = require("./fields/uint32Little");
const uint16Little_1 = require("./fields/uint16Little");
const digest32_1 = require("./fields/digest32");
const boost_utils_1 = require("./boost-utils");
class BoostPowStringModel {
    constructor(blockheader, metadata) {
        this._blockheader = blockheader;
        if (!this._blockheader.validProofOfWork()) {
            throw new Error('INVALID_POW');
        }
        if (metadata) {
            if (this._blockheader.merkleRoot !== metadata.hash.hex) {
                throw new Error('INVALID_METADATA');
            }
            this._metadata = metadata;
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
    static validProofOfWorkFromBuffer(buf) {
        const blockheader = bsv.BlockHeader.fromBuffer(buf);
        if (blockheader.validProofOfWork()) {
            return true;
        }
        return false;
    }
    static validProofOfWorkFromString(str) {
        const blockheader = bsv.BlockHeader.fromString(str);
        if (blockheader.validProofOfWork()) {
            return true;
        }
        return false;
    }
    static validProofOfWorkFromObject(obj) {
        const spoofedObj = {
            prevHash: obj.content,
            bits: obj.bits,
            version: obj.category,
            merkleRoot: obj.metadataHash,
            time: obj.time,
            nonce: obj.nonce,
        };
        const blockheader = bsv.BlockHeader.fromObject(spoofedObj);
        if (blockheader.validProofOfWork()) {
            return true;
        }
        return false;
    }
    /**
     * Check whether each element is a valid BoostPowString (POW!)
     *
     * If even a single entry is not valid, then an exception will be thrown and parsing of everything fails.
     *
     * Initially we can be strict because we should expect careful usage and passing of data.
     *
     * @param arrayOfPotentialBoostPowStrings Array of objects that have toString() defined
     */
    static fromStringArray(arrayOfPotentialBoostPowStrings) {
        // How cool is that!?
        const boostPowStrings = [];
        for (const candidate of arrayOfPotentialBoostPowStrings) {
            boostPowStrings.push(BoostPowStringModel.fromString(candidate));
        }
        return boostPowStrings;
    }
    static fromBuffer(buf) {
        return new BoostPowStringModel(bsv.BlockHeader.fromBuffer(buf));
    }
    static fromString(str) {
        var buf = Buffer.from(str, 'hex');
        return new BoostPowStringModel(bsv.BlockHeader.fromBuffer(buf));
    }
    static fromHex(str) {
        var buf = Buffer.from(str, 'hex');
        return new BoostPowStringModel(bsv.BlockHeader.fromBuffer(buf));
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
        return new BoostPowStringModel(bsv.BlockHeader.fromObject(spoofedObj));
    }
    static from(str) {
        var buf = Buffer.from(str, 'hex');
        return new BoostPowStringModel(bsv.BlockHeader.fromBuffer(buf));
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
exports.BoostPowStringModel = BoostPowStringModel;
