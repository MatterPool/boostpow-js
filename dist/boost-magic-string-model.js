"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bsv = require("bsv");
const boost_header_model_1 = require("./boost-header-model");
class BoostMagicStringModel {
    constructor(boostheader) {
        // If a BoostHeaderModel can be constructed, then the POW is valid (it was already validated at constructor)
        this._boostheader = boostheader;
        // But let's check the Pow again, because we can.
        if (!this._boostheader.validProofOfWork()) {
            throw new Error('INVALID_POW');
        }
    }
    hash() {
        return this._boostheader.hash();
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
        return new BoostMagicStringModel(boost_header_model_1.BoostHeaderModel.fromBuffer(buf));
    }
    static fromString(str) {
        return new BoostMagicStringModel(boost_header_model_1.BoostHeaderModel.fromString(str));
    }
    static fromObject(obj) {
        return new BoostMagicStringModel(boost_header_model_1.BoostHeaderModel.fromObject(obj));
    }
    toBuffer() {
        return this._boostheader.toBuffer();
    }
    toString() {
        return this._boostheader.toString();
    }
    toObject() {
        return this._boostheader.toObject();
    }
}
exports.BoostMagicStringModel = BoostMagicStringModel;
