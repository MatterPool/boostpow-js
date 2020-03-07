"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bsv = require("bsv");
const boost_pow_job_model_1 = require("./boost-pow-job-model");
class BoostPowAbstractModel {
    constructor(tag, minerAddress, unique, minerNonce, metadata) {
        this.tag = tag;
        this.minerAddress = minerAddress;
        this.unique = unique;
        this.minerNonce = minerNonce;
        this.metadata = metadata;
    }
    static fromObject(params) {
        return new BoostPowAbstractModel(boost_pow_job_model_1.BoostPowJobModel.createBufferAndPad(params.tag, 20), boost_pow_job_model_1.BoostPowJobModel.createBufferAndPad(params.minerAddress, 20), boost_pow_job_model_1.BoostPowJobModel.createBufferAndPad(params.unique, 8), boost_pow_job_model_1.BoostPowJobModel.createBufferAndPad(params.minerNonce, 8), boost_pow_job_model_1.BoostPowJobModel.createBufferAndPad(params.metadata, 32));
    }
    static fromBuffer(params) {
        return new BoostPowAbstractModel(params.tag, params.minerAddress, params.unique, params.minerNonce, params.metadata);
    }
    getTag() {
        return this.tag;
    }
    getMinerAddress() {
        return this.minerAddress;
    }
    getUnique() {
        return this.unique;
    }
    getMinerNonce() {
        return this.minerNonce;
    }
    getMetadata() {
        return this.metadata;
    }
    hash() {
        return bsv.crypto.Hash.sha256(this.toBuffer()).toString('hex');
    }
    hashAsBuffer() {
        return bsv.crypto.Hash.sha256(this.toBuffer());
    }
    toObject() {
        return {
            tag: (this.tag.toString('hex').match(/../g) || []).reverse().join(''),
            minerAddress: (this.minerAddress.toString('hex').match(/../g) || []).reverse().join(''),
            unique: (this.unique.toString('hex').match(/../g) || []).reverse().join(''),
            minerNonce: (this.minerNonce.toString('hex').match(/../g) || []).reverse().join(''),
            metadata: (this.metadata.toString('hex').match(/../g) || []).reverse().join(''),
        };
    }
    toBuffer() {
        return Buffer.concat([
            this.tag,
            this.minerAddress,
            this.unique,
            this.minerNonce,
            this.metadata
        ]);
    }
    toHex() {
        return Buffer.concat([
            this.tag,
            this.minerAddress,
            this.unique,
            this.minerNonce,
            this.metadata,
        ]).toString('hex');
    }
    static fromHex(str) {
        if ((str.length / 2) < 56 || (str.length / 2) > 88) {
            throw new Error('Invalid Boost Abstract');
        }
        return new BoostPowAbstractModel(Buffer.from(str.substr(0, 40), 'hex'), Buffer.from(str.substr(40, 40), 'hex'), Buffer.from(str.substr(80, 16), 'hex'), Buffer.from(str.substr(96, 16), 'hex'), Buffer.from(str.substr(112, 64), 'hex'));
    }
}
exports.BoostPowAbstractModel = BoostPowAbstractModel;
