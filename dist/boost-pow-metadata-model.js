"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoostPowMetadataModel = void 0;
const bsv = require("bsv");
const boost_utils_1 = require("./boost-utils");
const uint32Little_1 = require("./fields/uint32Little");
class BoostPowMetadataModel {
    constructor(tag, minerPubKeyHash, extraNonce1, extraNonce2, UserNonce, additionalData) {
        this.tag = tag;
        this.minerPubKeyHash = minerPubKeyHash;
        this.extraNonce1 = extraNonce1;
        this.extraNonce2 = extraNonce2;
        this.UserNonce = UserNonce;
        this.additionalData = additionalData;
    }
    static fromObject(params) {
        return new BoostPowMetadataModel(new Buffer(params.tag, 'hex'), boost_utils_1.BoostUtils.createBufferAndPad(params.minerPubKeyHash, 20, false), boost_utils_1.BoostUtils.createBufferAndPad(params.extraNonce1, 4, false), boost_utils_1.BoostUtils.createBufferAndPad(params.extraNonce2, 8, false), new uint32Little_1.UInt32Little(boost_utils_1.BoostUtils.createBufferAndPad(params.userNonce, 4, false)), new Buffer(params.additionalData, 'hex'));
    }
    static fromBuffer(params) {
        return new BoostPowMetadataModel(params.tag, params.minerPubKeyHash, params.extraNonce1, params.extraNonce2, new uint32Little_1.UInt32Little(params.userNonce), params.additionalData);
    }
    getTag() {
        return this.tag;
    }
    getTagUtf8() {
        return boost_utils_1.BoostUtils.trimBufferString(this.tag, true);
    }
    getTagString() {
        return this.getTagUtf8();
    }
    getMinerPubKeyHash() {
        return this.minerPubKeyHash;
    }
    getMinerPubKeyHashUtf8() {
        return this.minerPubKeyHash.toString('hex');
    }
    userNonce() {
        return this.UserNonce;
    }
    getExtraNonce1Number() {
        return parseInt(this.extraNonce1.toString('hex'), 16);
    }
    getExtraNonce1() {
        return this.extraNonce1;
    }
    getExtraNonce2Number() {
        return parseInt(this.extraNonce2.toString('hex'), 16);
    }
    getExtraNonce2() {
        return this.extraNonce2;
    }
    getAdditionalData() {
        return this.additionalData;
    }
    getAdditionalDataUtf8() {
        return boost_utils_1.BoostUtils.trimBufferString(this.additionalData, true);
    }
    getAdditionalDataString() {
        return this.getAdditionalDataUtf8();
    }
    toString() {
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
    toObject() {
        return {
            tag: this.tag.toString('hex'),
            minerPubKeyHash: this.minerPubKeyHash.toString('hex'),
            extraNonce1: this.extraNonce1.toString('hex'),
            extraNonce2: this.extraNonce2.toString('hex'),
            userNonce: this.UserNonce.hex(),
            additionalData: this.additionalData.toString('hex'),
        };
    }
    toBuffer() {
        return Buffer.concat([
            this.tag,
            this.minerPubKeyHash,
            this.extraNonce1,
            this.extraNonce2,
            this.UserNonce.buffer(),
            this.additionalData
        ]);
    }
    toHex() {
        return this.toBuffer().toString('hex');
    }
}
exports.BoostPowMetadataModel = BoostPowMetadataModel;
