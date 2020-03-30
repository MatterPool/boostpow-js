"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bsv = require("bsv");
const boost_utils_1 = require("./boost-utils");
/**
 * Responsible for redeem script proof that work was done.
 * This gets combined with BoostPowJobModel
 */
class BoostPowJobProofModel {
    constructor(signature, minerPubKey, time, extraNonce1, extraNonce2, nonce, minerPubKeyHash, 
    // Optional tx information attached or not
    txid, vout, value) {
        this.signature = signature;
        this.minerPubKey = minerPubKey;
        this.time = time;
        this.extraNonce1 = extraNonce1;
        this.extraNonce2 = extraNonce2;
        this.nonce = nonce;
        this.minerPubKeyHash = minerPubKeyHash;
        this.txid = txid;
        this.vout = vout;
        this.value = value;
    }
    static fromObject(params) {
        if (params.signature && params.signature.length > 166) {
            throw new Error('signature too large. Max 83 bytes.');
        }
        if (params.minerPubKey && params.minerPubKey.length > 66) {
            throw new Error('minerPubKey too large. Max 33 bytes.');
        }
        if (params.nonce && params.nonce.length > 8) {
            throw new Error('nonce too large. Max 4 bytes.');
        }
        if (params.extraNonce1 && params.extraNonce1.length > 8) {
            throw new Error('extraNonce1 too large. Max 4 bytes.');
        }
        if (params.extraNonce2 && params.extraNonce2.length > 16) {
            throw new Error('extraNonce2 too large. Max 8 bytes.');
        }
        if (params.minerPubKeyHash && params.minerPubKeyHash.length > 40) {
            throw new Error('minerPubKeyHash too large. Max 20 bytes.');
        }
        return new BoostPowJobProofModel(Buffer.from(params.signature, 'hex'), boost_utils_1.BoostUtils.createBufferAndPad(params.minerPubKey, 33, false), boost_utils_1.BoostUtils.createBufferAndPad(params.time, 4), boost_utils_1.BoostUtils.createBufferAndPad(params.extraNonce1, 4), boost_utils_1.BoostUtils.createBufferAndPad(params.extraNonce2, 8, false), boost_utils_1.BoostUtils.createBufferAndPad(params.nonce, 4), boost_utils_1.BoostUtils.createBufferAndPad(params.minerPubKeyHash, 20, false));
    }
    getTime() {
        return this.time;
    }
    getTimeNumber() {
        return parseInt((this.time.toString('hex').match(/../g) || []).reverse().join(''), 16);
    }
    getTimeBuffer() {
        return this.time;
    }
    setTime(time) {
        this.time = boost_utils_1.BoostUtils.createBufferAndPad(time, 4);
    }
    getExtraNonce1Number() {
        return parseInt((this.extraNonce1.toString('hex').match(/../g) || []).join(''), 16);
    }
    getExtraNonce1() {
        return this.extraNonce1;
    }
    getExtraNonce2Number() {
        return parseInt((this.extraNonce2.toString('hex').match(/../g) || []).reverse().join(''), 16);
    }
    getExtraNonce2() {
        return this.extraNonce2;
    }
    getNonceNumber() {
        return parseInt((this.nonce.toString('hex').match(/../g) || []).reverse().join(''), 16);
    }
    getNonce() {
        return this.nonce;
    }
    setNonce(nonce) {
        this.nonce = boost_utils_1.BoostUtils.createBufferAndPad(nonce, 4);
    }
    setExtraNonce1(nonce) {
        this.extraNonce1 = boost_utils_1.BoostUtils.createBufferAndPad(nonce, 4);
    }
    setExtraNonce2(nonce) {
        this.extraNonce2 = boost_utils_1.BoostUtils.createBufferAndPad(nonce, 8);
    }
    // Should add bsv.Address version and string version too
    getMinerPubKeyHash() {
        return this.minerPubKeyHash;
    }
    getMinerPubKeyHashHex() {
        return this.minerPubKeyHash.toString('hex');
    }
    setSignature(signature) {
        this.signature = Buffer.from(signature, 'hex');
    }
    setSignatureBuffer(signature) {
        this.signature = signature;
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
    /**
     *
     * @param publicKey The publicKey key string to use to redeem the Boost output
     */
    setMinerPubKeyAndHash(publicKey) {
        const pubKey = new bsv.PublicKey(publicKey);
        this.minerPubKey = pubKey.toBuffer();
        this.minerPubKeyHash = pubKey.toAddress().toBuffer().slice(1);
    }
    toObject() {
        return {
            // Output to string first, then flip endianness so we do not accidentally modify underlying buffer
            signature: (this.signature.toString('hex').match(/../g) || []).join(''),
            minerPubKey: (this.minerPubKey.toString('hex').match(/../g) || []).join(''),
            time: (this.time.toString('hex').match(/../g) || []).reverse().join(''),
            nonce: (this.nonce.toString('hex').match(/../g) || []).reverse().join(''),
            extraNonce1: (this.extraNonce1.toString('hex').match(/../g) || []).reverse().join(''),
            extraNonce2: (this.extraNonce2.toString('hex').match(/../g) || []).join(''),
            minerPubKeyHash: (this.minerPubKeyHash.toString('hex').match(/../g) || []).join(''),
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
        buildOut.add(this.nonce.reverse());
        // Add time
        buildOut.add(this.time.reverse());
        // Add extra nonce2
        buildOut.add(this.extraNonce2);
        // Add extra nonce 1
        buildOut.add(this.extraNonce1);
        // Add miner address
        buildOut.add(this.minerPubKeyHash);
        for (let i = 0; i < buildOut.chunks.length; i++) {
            if (!buildOut.checkMinimalPush(i)) {
                console.log('not minimal push!-======================', i);
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
        let o = 0;
        for (const out of tx.outputs) {
            try {
                return BoostPowJobProofModel.fromScript(out.script, tx.hash, o, out.satoshis);
            }
            catch (ex) {
                // Skip and try another output
            }
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
    static fromScript(script, txid, vout, value) {
        return BoostPowJobProofModel.fromHex(script, txid, vout, value);
    }
    static fromHex(asm, txid, vout, value) {
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
            nonce = script.chunks[2].buf;
            time = script.chunks[3].buf;
            extraNonce2 = script.chunks[4].buf;
            extraNonce1 = script.chunks[5].buf;
            minerPubKeyHash = script.chunks[6].buf;
            return new BoostPowJobProofModel(signature, minerPubKey, time, extraNonce1, extraNonce2, nonce, minerPubKeyHash, txid, vout, value);
        }
        throw new Error('Not valid Boost Proof');
    }
    static fromASM(asm, txid, vout, value) {
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
            nonce = script.chunks[2].buf;
            time = script.chunks[3].buf;
            extraNonce2 = script.chunks[4].buf;
            extraNonce1 = script.chunks[5].buf;
            minerPubKeyHash = script.chunks[6].buf;
            return new BoostPowJobProofModel(signature, minerPubKey, time, extraNonce1, extraNonce2, nonce, minerPubKeyHash, txid, vout, value);
        }
        throw new Error('Not valid Boost Proof');
    }
    // Optional attached information if available
    getTxOutpoint() {
        return {
            txid: this.txid,
            vout: this.vout,
            value: this.value,
        };
    }
    // Optional attached information if available
    getTxid() {
        return this.txid;
    }
    // Optional attached information if available
    getVout() {
        return this.vout;
    }
    // Optional attached information if available
    getValue() {
        return this.value;
    }
    toASM() {
        const makeHex = this.toHex();
        const makeAsm = new bsv.Script(makeHex);
        return makeAsm.toASM();
    }
    static fromASM2(str, txid, vout, value) {
        return BoostPowJobProofModel.fromHex(str, txid, vout, value);
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
    static fromString(str, txid, vout, value) {
        return BoostPowJobProofModel.fromHex(str, txid, vout, value);
    }
}
exports.BoostPowJobProofModel = BoostPowJobProofModel;
