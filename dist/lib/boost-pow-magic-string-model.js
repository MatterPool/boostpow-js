"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bsv = require("bsv");
class BoostPowMagicStringModel {
    constructor(blockheader) {
        this._boostheader = blockheader;
        if (!this._boostheader.validProofOfWork()) {
            throw new Error('INVALID_POW');
        }
    }
    hash() {
        return this._boostheader.hash;
    }
    validProofOfWork() {
        return this._boostheader.validProofOfWork();
    }
    static fromBuffer(buf) {
        return new BoostPowMagicStringModel(bsv.BlockHeader.fromBuffer(buf));
    }
    static fromString(str) {
        var buf = Buffer.from(str, 'hex');
        return new BoostPowMagicStringModel(bsv.BlockHeader.fromBuffer(buf));
    }
    static fromObject(obj) {
        const spoofedObj = {
            prevHash: obj.content,
            bits: obj.bits,
            version: obj.version,
            merkleRoot: obj.abstract,
            time: obj.time,
            nonce: obj.nonce,
        };
        return new BoostPowMagicStringModel(bsv.BlockHeader.fromObject(spoofedObj));
    }
    toBuffer() {
        return this._boostheader.toBufferWriter().concat();
    }
    toString() {
        return this._boostheader.toBuffer().toString('hex');
    }
    toObject() {
        const blockheaderObj = this._boostheader.toObject();
        const boostheaderObj = {
            hash: blockheaderObj.hash,
            content: blockheaderObj.prevHash,
            bits: blockheaderObj.bits,
            version: blockheaderObj.version,
            abstract: blockheaderObj.merkleRoot,
            time: blockheaderObj.time,
            nonce: blockheaderObj.nonce,
        };
        return boostheaderObj;
    }
}
exports.BoostPowMagicStringModel = BoostPowMagicStringModel;
