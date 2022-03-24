"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoostPowMetadataModel = void 0;
const bsv = require("bsv");
const boost_utils_1 = require("./boost-utils");
const uint32Little_1 = require("./fields/uint32Little");
const uint32Big_1 = require("./fields/uint32Big");
const uint64Big_1 = require("./fields/uint64Big");
const digest32_1 = require("./fields/digest32");
const digest20_1 = require("./fields/digest20");
const bytes_1 = require("./fields/bytes");
class BoostPowMetadataModel {
    constructor(Tag, MinerPubKeyHash, ExtraNonce1, ExtraNonce2, UserNonce, AdditionalData) {
        this.Tag = Tag;
        this.MinerPubKeyHash = MinerPubKeyHash;
        this.ExtraNonce1 = ExtraNonce1;
        this.ExtraNonce2 = ExtraNonce2;
        this.UserNonce = UserNonce;
        this.AdditionalData = AdditionalData;
    }
    static fromObject(params) {
        return new BoostPowMetadataModel(new bytes_1.Bytes(new Buffer(params.tag, 'hex')), new digest20_1.Digest20(boost_utils_1.BoostUtils.createBufferAndPad(params.minerPubKeyHash, 20, false)), new uint32Big_1.UInt32Big(boost_utils_1.BoostUtils.createBufferAndPad(params.extraNonce1, 4, false)), new uint64Big_1.UInt64Big(boost_utils_1.BoostUtils.createBufferAndPad(params.extraNonce2, 8, false)), new uint32Little_1.UInt32Little(boost_utils_1.BoostUtils.createBufferAndPad(params.userNonce, 4, false)), new bytes_1.Bytes(new Buffer(params.additionalData, 'hex')));
    }
    static fromBuffer(params) {
        return new BoostPowMetadataModel(new bytes_1.Bytes(params.tag), new digest20_1.Digest20(params.minerPubKeyHash), new uint32Big_1.UInt32Big(params.extraNonce1), new uint64Big_1.UInt64Big(params.extraNonce2), new uint32Little_1.UInt32Little(params.userNonce), new bytes_1.Bytes(params.additionalData));
    }
    get tag() {
        return this.Tag;
    }
    get minerPubKeyHash() {
        return this.MinerPubKeyHash;
    }
    get userNonce() {
        return this.UserNonce;
    }
    get extraNonce1() {
        return this.ExtraNonce1;
    }
    get extraNonce2() {
        return this.ExtraNonce2;
    }
    get additionalData() {
        return this.AdditionalData;
    }
    get getCoinbaseString() {
        return this.toString();
    }
    get hash() {
        return new digest32_1.Digest32(bsv.crypto.Hash.sha256sha256(this.toBuffer()));
    }
    toString() {
        return this.toBuffer().toString('hex');
    }
    toObject() {
        return {
            tag: this.Tag.hex,
            minerPubKeyHash: this.minerPubKeyHash.hex,
            extraNonce1: this.extraNonce1.hex,
            extraNonce2: this.extraNonce2.hex,
            userNonce: this.userNonce.hex,
            additionalData: this.additionalData.hex,
        };
    }
    toBuffer() {
        return Buffer.concat([
            this.tag.buffer,
            this.minerPubKeyHash.buffer,
            this.extraNonce1.buffer,
            this.extraNonce2.buffer,
            this.userNonce.buffer,
            this.additionalData.buffer
        ]);
    }
    toHex() {
        return this.toBuffer().toString('hex');
    }
}
exports.BoostPowMetadataModel = BoostPowMetadataModel;
