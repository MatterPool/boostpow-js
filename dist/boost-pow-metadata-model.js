"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bsv = require("bsv");
const boost_utils_1 = require("./boost-utils");
class BoostPowMetadataModel {
    constructor(tag, minerPubKeyHash, extraNonce1, extraNonce2, userNonce, additionalData) {
        this.tag = tag;
        this.minerPubKeyHash = minerPubKeyHash;
        this.extraNonce1 = extraNonce1;
        this.extraNonce2 = extraNonce2;
        this.userNonce = userNonce;
        this.additionalData = additionalData;
    }
    static fromObject(params) {
        return new BoostPowMetadataModel(boost_utils_1.BoostUtils.createBufferAndPad(params.tag, 20), boost_utils_1.BoostUtils.createBufferAndPad(params.minerPubKeyHash, 20), boost_utils_1.BoostUtils.createBufferAndPad(params.extraNonce1, 4), boost_utils_1.BoostUtils.createBufferAndPad(params.extraNonce2, 4), boost_utils_1.BoostUtils.createBufferAndPad(params.userNonce, 4), boost_utils_1.BoostUtils.createBufferAndPad(params.additionalData, 32));
    }
    static fromBuffer(params) {
        return new BoostPowMetadataModel(params.tag, params.minerPubKeyHash, params.extraNonce1, params.extraNonce2, params.userNonce, params.additionalData);
    }
    getTag() {
        return this.tag;
    }
    getMinerPubKeyHash() {
        return this.minerPubKeyHash;
    }
    getUserNonce() {
        return this.userNonce;
    }
    getExtraNonce1() {
        return this.extraNonce1;
    }
    getExtraNonce2() {
        return this.extraNonce2;
    }
    getAdditionalData() {
        return this.additionalData;
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
        return bsv.crypto.Hash.sha256sha256(this.toBuffer()).reverse();
    }
    toObject() {
        return {
            tag: (this.tag.toString('hex').match(/../g) || []).reverse().join(''),
            minerPubKeyHash: (this.minerPubKeyHash.toString('hex').match(/../g) || []).reverse().join(''),
            extraNonce1: (this.extraNonce1.toString('hex').match(/../g) || []).reverse().join(''),
            extraNonce2: (this.extraNonce2.toString('hex').match(/../g) || []).reverse().join(''),
            userNonce: (this.userNonce.toString('hex').match(/../g) || []).reverse().join(''),
            additionalData: (this.additionalData.toString('hex').match(/../g) || []).reverse().join(''),
        };
    }
    toBuffer() {
        return Buffer.concat([
            this.tag,
            this.minerPubKeyHash,
            this.extraNonce1,
            this.extraNonce2,
            this.userNonce,
            this.additionalData
        ]);
    }
    toHex() {
        return this.toBuffer().toString('hex');
    }
    static fromHex(str) {
        if ((str.length / 2) !== 84) {
            throw new Error('Invalid Boost Metadata');
        }
        return new BoostPowMetadataModel(Buffer.from(str.substr(0, 40), 'hex'), Buffer.from(str.substr(40, 40), 'hex'), Buffer.from(str.substr(80, 8), 'hex'), Buffer.from(str.substr(88, 8), 'hex'), Buffer.from(str.substr(96, 8), 'hex'), Buffer.from(str.substr(104, 64), 'hex'));
    }
}
exports.BoostPowMetadataModel = BoostPowMetadataModel;
