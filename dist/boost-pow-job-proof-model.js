"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bsv = require("bsv");
const boost_pow_job_model_1 = require("./boost-pow-job-model");
/**
 * Responsible for redeem script proof that work was done.
 * This gets combined with BoostPowJobModel
 */
class BoostPowJobProofModel {
    constructor(signature, minerPubKey, time, minerNonce, minerAddress) {
        this.signature = signature;
        this.minerPubKey = minerPubKey;
        this.time = time;
        this.minerNonce = minerNonce;
        this.minerAddress = minerAddress;
    }
    static fromObject(params) {
        return new BoostPowJobProofModel(boost_pow_job_model_1.BoostPowJobModel.createBufferAndPad(params.signature, 32), boost_pow_job_model_1.BoostPowJobModel.createBufferAndPad(params.minerPubKey, 32), boost_pow_job_model_1.BoostPowJobModel.createBufferAndPad(params.time, 4), boost_pow_job_model_1.BoostPowJobModel.createBufferAndPad(params.minerNonce, 8), boost_pow_job_model_1.BoostPowJobModel.createBufferAndPad(params.minerAddress, 20));
    }
    getSignature() {
        return this.signature;
    }
    getMinerPubKey() {
        return this.minerPubKey;
    }
    getTime() {
        return this.time;
    }
    getMinerNonce() {
        return this.minerNonce;
    }
    getMinerAddress() {
        return this.minerAddress;
    }
    toObject() {
        return {
            // Output to string first, then flip endianness so we do not accidentally modify underlying buffer
            signature: (this.signature.toString('hex').match(/../g) || []).reverse().join(''),
            minerPubKey: (this.minerPubKey.toString('hex').match(/../g) || []).reverse().join(''),
            time: (this.time.toString('hex').match(/../g) || []).reverse().join(''),
            minerNonce: (this.minerNonce.toString('hex').match(/../g) || []).reverse().join(''),
            minerAddress: (this.minerAddress.toString('hex').match(/../g) || []).reverse().join(''),
        };
    }
    toHex() {
        let buildOut = bsv.Script();
        // Add signature
        buildOut.add(this.signature);
        // Add miner pub key
        buildOut.add(this.minerPubKey);
        // Add time
        buildOut.add(this.time);
        // Add miner nonce
        buildOut.add(this.minerNonce);
        // Add miner address
        buildOut.add(this.minerAddress);
        const hex = buildOut.toHex();
        const fromhex = bsv.Script.fromHex(hex);
        const hexIso = fromhex.toHex();
        if (hex != hexIso) {
            throw new Error('Not isomorphic');
        }
        return hexIso;
    }
    static fromHex(asm) {
        const script = new bsv.Script(asm);
        let signature;
        let minerPubKey;
        let time;
        let minerNonce;
        let minerAddress;
        if (5 === script.chunks.length &&
            // signature
            script.chunks[0].len &&
            // script.chunks[0].opcodenum === 4 &&
            // minerPubKey
            script.chunks[1].len &&
            // script.chunks[1].len === 32 &&
            // time
            script.chunks[2].len &&
            // script.chunks[2].len === 4 &&
            // minerNonce
            script.chunks[3].len &&
            // script.chunks[3].len === 20 &&
            // minerAddress
            script.chunks[4].len
        // script.chunks[4].len === 8
        ) {
            signature = script.chunks[0].buf;
            minerPubKey = script.chunks[1].buf;
            time = script.chunks[2].buf;
            minerNonce = script.chunks[3].buf;
            minerAddress = script.chunks[4].buf;
            return new BoostPowJobProofModel(signature, minerPubKey, time, minerNonce, minerAddress);
        }
        throw new Error('Not valid Boost Proof');
    }
    toASM() {
        const makeHex = this.toHex();
        const makeAsm = new bsv.Script(makeHex);
        return makeAsm.toASM();
    }
    static fromASM(str) {
        return BoostPowJobProofModel.fromHex(str);
    }
    toString() {
        const makeHex = this.toHex();
        const makeAsm = new bsv.Script(makeHex);
        return makeAsm.toString();
    }
    static fromString(str) {
        return BoostPowJobProofModel.fromHex(str);
    }
}
exports.BoostPowJobProofModel = BoostPowJobProofModel;
