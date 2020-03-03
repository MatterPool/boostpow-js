"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bsv = require("bsv");
class BoostHeaderModel {
    constructor(blockheader) {
        this._blockheader = blockheader;
        if (!this._blockheader.validProofOfWork()) {
            throw new Error('INVALID_POW');
        }
    }
    hash() {
        return this._blockheader.hash;
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
            version: obj.version,
            merkleRoot: obj.abstract,
            time: obj.time,
            nonce: obj.nonce,
        };
        const blockheader = bsv.BlockHeader.fromObject(spoofedObj);
        if (blockheader.validProofOfWork()) {
            return true;
        }
        return false;
    }
    static fromBuffer(buf) {
        return new BoostHeaderModel(bsv.BlockHeader.fromBuffer(buf));
    }
    static fromString(str) {
        var buf = Buffer.from(str, 'hex');
        return new BoostHeaderModel(bsv.BlockHeader.fromBuffer(buf));
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
        return new BoostHeaderModel(bsv.BlockHeader.fromObject(spoofedObj));
    }
    toBuffer() {
        return this._blockheader.toBufferWriter().concat();
    }
    toString() {
        return this._blockheader.toBuffer().toString('hex');
    }
    toObject() {
        const blockheaderObj = this._blockheader.toObject();
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
exports.BoostHeaderModel = BoostHeaderModel;
