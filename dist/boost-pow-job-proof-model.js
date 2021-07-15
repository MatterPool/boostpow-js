"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoostPowJobProofModel = void 0;
const bsv = require("bsv");
const boost_utils_1 = require("./boost-utils");
const uint32Little_1 = require("./fields/uint32Little");
const uint32Big_1 = require("./fields/uint32Big");
const uint64Big_1 = require("./fields/uint64Big");
const digest20_1 = require("./fields/digest20");
/**
 * Responsible for redeem script proof that work was done.
 * This gets combined with BoostPowJobModel
 */
class BoostPowJobProofModel {
    constructor(signature, minerPubKey, Time, ExtraNonce1, ExtraNonce2, Nonce, MinerPubKeyHash, 
    // Optional tx information attached or not
    txid, vin, spentTxid, spentVout) {
        this.signature = signature;
        this.minerPubKey = minerPubKey;
        this.Time = Time;
        this.ExtraNonce1 = ExtraNonce1;
        this.ExtraNonce2 = ExtraNonce2;
        this.Nonce = Nonce;
        this.MinerPubKeyHash = MinerPubKeyHash;
        this.txid = txid;
        this.vin = vin;
        this.spentTxid = spentTxid;
        this.spentVout = spentVout;
    }
    static fromObject(params) {
        if (params.signature.length > 166) {
            throw new Error('signature too large. Max 83 bytes.');
        }
        if (params.minerPubKey.length != 66 && params.minerPubKey.length != 130) {
            throw new Error('minerPubKey too large. Max 65 bytes.');
        }
        if (params.nonce.length > 8) {
            throw new Error('nonce too large. Max 4 bytes.');
        }
        if (params.extraNonce1.length > 8) {
            throw new Error('extraNonce1 too large. Max 4 bytes.');
        }
        if (params.extraNonce2.length > 16) {
            throw new Error('extraNonce2 too large. Max 8 bytes.');
        }
        let minerPubKey = Buffer.from(params.minerPubKey, 'hex');
        let minerPubKeyHash;
        if (params.minerPubKeyHash) {
            if (params.minerPubKeyHash.length != 40) {
                throw new Error('minerPubKeyHash too large. Max 20 bytes.');
            }
            minerPubKeyHash = params.minerPubKeyHash;
        }
        else {
            minerPubKeyHash = bsv.crypto.hash.sha256ripemd160(minerPubKey).toString('hex');
        }
        return new BoostPowJobProofModel(Buffer.from(params.signature, 'hex'), minerPubKey, new uint32Little_1.UInt32Little(boost_utils_1.BoostUtils.createBufferAndPad(params.time, 4, false)), new uint32Big_1.UInt32Big(boost_utils_1.BoostUtils.createBufferAndPad(params.extraNonce1, 4, false)), new uint64Big_1.UInt64Big(boost_utils_1.BoostUtils.createBufferAndPad(params.extraNonce2, 8, false)), new uint32Little_1.UInt32Little(boost_utils_1.BoostUtils.createBufferAndPad(params.nonce, 4, false)), new digest20_1.Digest20(Buffer.from(minerPubKeyHash, 'hex')));
    }
    time() {
        return this.Time;
    }
    extraNonce1() {
        return this.ExtraNonce1;
    }
    extraNonce2() {
        return this.ExtraNonce2;
    }
    nonce() {
        return this.Nonce;
    }
    // Should add bsv.Address version and string version too
    minerPubKeyHash() {
        return this.MinerPubKeyHash;
    }
    getSignature() {
        return this.signature;
    }
    getSignatureHex() {
        return this.signature.toString('hex');
    }
    getMinerPubKey() {
        return this.minerPubKey;
    }
    getMinerPubKeyHex() {
        return this.minerPubKey.toString('hex');
    }
    toObject() {
        return {
            // Output to string first, then flip endianness so we do not accidentally modify underlying buffer
            signature: this.signature.toString('hex'),
            minerPubKey: this.minerPubKey.toString('hex'),
            time: this.Time.hex(),
            nonce: this.Nonce.hex(),
            extraNonce1: this.ExtraNonce1.hex(),
            extraNonce2: this.ExtraNonce2.hex(),
            minerPubKeyHash: this.MinerPubKeyHash.hex(),
        };
    }
    toHex() {
        let buildOut = bsv.Script();
        // Add signature
        buildOut.add(this.signature);
        /* Buffer.concat([
             this.signature.toBuffer(),
             Buffer.from([sigtype & 0xff])
           ]*/
        // Add miner pub key
        buildOut.add(this.minerPubKey);
        // Add miner nonce
        buildOut.add(this.Nonce.buffer());
        // Add time
        buildOut.add(this.Time.buffer());
        // Add extra nonce2
        buildOut.add(this.ExtraNonce2.buffer());
        // Add extra nonce 1
        buildOut.add(this.ExtraNonce1.buffer());
        // Add miner address
        buildOut.add(this.MinerPubKeyHash.buffer());
        for (let i = 0; i < buildOut.chunks.length; i++) {
            if (!buildOut.checkMinimalPush(i)) {
                throw new Error('not min push');
            }
        }
        const hex = buildOut.toHex();
        const fromhex = bsv.Script.fromHex(hex);
        const hexIso = fromhex.toHex();
        if (hex != hexIso) {
            throw new Error('Not isomorphic');
        }
        return hexIso;
    }
    static fromTransaction(tx) {
        if (!tx) {
            return undefined;
        }
        let inp = 0;
        for (const input of tx.inputs) {
            try {
                return BoostPowJobProofModel.fromScript(input.script, tx.hash, inp, input.prevTxId.toString('hex'), input.outputIndex); // spentTx, spentVout);
            }
            catch (ex) {
                // Skip and try another output
            }
            inp++;
        }
        return undefined;
    }
    static fromRawTransaction(rawtx) {
        if (!rawtx || rawtx === '') {
            return undefined;
        }
        const tx = new bsv.Transaction(rawtx);
        return BoostPowJobProofModel.fromTransaction(tx);
    }
    static fromScript(script, txid, vin, spentTxid, spentVout) {
        return BoostPowJobProofModel.fromHex(script, txid, vin, spentTxid, spentVout);
    }
    static fromHex(asm, txid, vin, spentTxid, spentVout) {
        const script = new bsv.Script(asm);
        let signature;
        let minerPubKey;
        let time;
        let nonce;
        let extraNonce1;
        let extraNonce2;
        let minerPubKeyHash;
        if (7 === script.chunks.length &&
            // signature
            script.chunks[0].len &&
            // minerPubKey
            script.chunks[1].len &&
            // nonce
            script.chunks[2].len &&
            // time
            script.chunks[3].len &&
            // extra Nonce 2
            script.chunks[4].len &&
            // extra Nonce 1
            script.chunks[5].len &&
            // minerPubKeyHash
            script.chunks[6].len) {
            signature = script.chunks[0].buf;
            minerPubKey = script.chunks[1].buf;
            nonce = new uint32Little_1.UInt32Little(script.chunks[2].buf);
            time = new uint32Little_1.UInt32Little(script.chunks[3].buf);
            extraNonce2 = new uint32Big_1.UInt32Big(script.chunks[4].buf);
            extraNonce1 = new uint64Big_1.UInt64Big(script.chunks[5].buf);
            minerPubKeyHash = new digest20_1.Digest20(script.chunks[6].buf);
            return new BoostPowJobProofModel(signature, minerPubKey, time, extraNonce1, extraNonce2, nonce, minerPubKeyHash, txid, vin, spentTxid, spentVout);
        }
        throw new Error('Not valid Boost Proof');
    }
    static fromASM(asm, txid, vin, spentTxid, spentVout) {
        const script = new bsv.Script.fromASM(asm);
        let signature;
        let minerPubKey;
        let time;
        let nonce;
        let extraNonce1;
        let extraNonce2;
        let minerPubKeyHash;
        if (7 === script.chunks.length &&
            // signature
            script.chunks[0].len &&
            // minerPubKey
            script.chunks[1].len &&
            // nonce
            script.chunks[2].len &&
            // time
            script.chunks[3].len &&
            // extra Nonce 2
            script.chunks[4].len &&
            // extra Nonce 1
            script.chunks[5].len &&
            // minerPubKeyHash
            script.chunks[6].len) {
            signature = script.chunks[0].buf;
            minerPubKey = script.chunks[1].buf;
            nonce = new uint32Little_1.UInt32Little(script.chunks[2].buf);
            time = new uint32Little_1.UInt32Little(script.chunks[3].buf);
            extraNonce2 = new uint32Big_1.UInt32Big(script.chunks[4].buf);
            extraNonce1 = new uint64Big_1.UInt64Big(script.chunks[5].buf);
            minerPubKeyHash = new digest20_1.Digest20(script.chunks[6].buf);
            return new BoostPowJobProofModel(signature, minerPubKey, time, extraNonce1, extraNonce2, nonce, minerPubKeyHash, txid, vin, spentTxid, spentVout);
        }
        throw new Error('Not valid Boost Proof');
    }
    // Optional attached information if available
    getTxInpoint() {
        return {
            txid: this.txid,
            vin: this.vin,
        };
    }
    // Optional attached information if available
    getTxid() {
        return this.txid;
    }
    // Optional attached information if available
    getVin() {
        return this.vin;
    }
    getSpentTxid() {
        return this.spentTxid;
    }
    // Optional attached information if available
    getSpentVout() {
        return this.spentVout;
    }
    toASM() {
        const makeHex = this.toHex();
        const makeAsm = new bsv.Script(makeHex);
        return makeAsm.toASM();
    }
    static fromASM2(str, txid, vin) {
        return BoostPowJobProofModel.fromHex(str, txid, vin);
    }
    toString() {
        const makeHex = this.toHex();
        const makeAsm = new bsv.Script(makeHex);
        return makeAsm.toString();
    }
    toBuffer() {
        const makeHex = this.toHex();
        const makeAsm = new bsv.Script(makeHex);
        return makeAsm.toBuffer();
    }
    static fromString(str, txid, vin) {
        return BoostPowJobProofModel.fromHex(str, txid, vin);
    }
}
exports.BoostPowJobProofModel = BoostPowJobProofModel;
