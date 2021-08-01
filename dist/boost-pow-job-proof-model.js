"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoostPowJobProofModel = void 0;
const bsv = require("bsv");
const boost_utils_1 = require("./boost-utils");
const uint32Little_1 = require("./fields/uint32Little");
const uint32Big_1 = require("./fields/uint32Big");
const uint64Big_1 = require("./fields/uint64Big");
const digest20_1 = require("./fields/digest20");
const bytes_1 = require("./fields/bytes");
/**
 * Responsible for redeem script proof that work was done.
 * This gets combined with BoostPowJobModel
 */
class BoostPowJobProofModel {
    constructor(Signature, MinerPubKey, Time, ExtraNonce1, ExtraNonce2, Nonce, MinerPubKeyHash, GeneralPurposeBits, 
    // Optional tx information attached or not
    Txid, Vin, SpentTxid, SpentVout) {
        this.Signature = Signature;
        this.MinerPubKey = MinerPubKey;
        this.Time = Time;
        this.ExtraNonce1 = ExtraNonce1;
        this.ExtraNonce2 = ExtraNonce2;
        this.Nonce = Nonce;
        this.MinerPubKeyHash = MinerPubKeyHash;
        this.GeneralPurposeBits = GeneralPurposeBits;
        this.Txid = Txid;
        this.Vin = Vin;
        this.SpentTxid = SpentTxid;
        this.SpentVout = SpentVout;
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
        let generalPurposeBits;
        if (params.generalPurposeBits) {
            if (params.generalPurposeBits.length > 8) {
                throw new Error('generalPurposeBits too large. Max 8 bytes.');
            }
            generalPurposeBits = new uint32Little_1.UInt32Little(boost_utils_1.BoostUtils.createBufferAndPad(params.generalPurposeBits, 4, false));
        }
        return new BoostPowJobProofModel(new bytes_1.Bytes(Buffer.from(params.signature, 'hex')), new bytes_1.Bytes(minerPubKey), new uint32Little_1.UInt32Little(boost_utils_1.BoostUtils.createBufferAndPad(params.time, 4, false)), new uint32Big_1.UInt32Big(boost_utils_1.BoostUtils.createBufferAndPad(params.extraNonce1, 4, false)), new uint64Big_1.UInt64Big(boost_utils_1.BoostUtils.createBufferAndPad(params.extraNonce2, 8, false)), new uint32Little_1.UInt32Little(boost_utils_1.BoostUtils.createBufferAndPad(params.nonce, 4, false)), new digest20_1.Digest20(Buffer.from(minerPubKeyHash, 'hex')), generalPurposeBits);
    }
    get time() {
        return this.Time;
    }
    get generalPurposeBits() {
        return this.GeneralPurposeBits;
    }
    get extraNonce1() {
        return this.ExtraNonce1;
    }
    get extraNonce2() {
        return this.ExtraNonce2;
    }
    get nonce() {
        return this.Nonce;
    }
    // Should add bsv.Address version and string version too
    get minerPubKeyHash() {
        return this.MinerPubKeyHash;
    }
    get signature() {
        return this.Signature;
    }
    get minerPubKey() {
        return this.MinerPubKey;
    }
    isContract() {
        return !this.MinerPubKeyHash;
    }
    isBounty() {
        return !!this.MinerPubKeyHash;
    }
    toObject() {
        let obj = {
            // Output to string first, then flip endianness so we do not accidentally modify underlying buffer
            signature: this.signature.hex,
            minerPubKey: this.minerPubKey.hex,
            time: this.time.hex,
            nonce: this.nonce.hex,
            extraNonce1: this.extraNonce1.hex,
            extraNonce2: this.extraNonce2.hex
        };
        if (this.generalPurposeBits) {
            obj["generalPurposeBits"] = this.generalPurposeBits.hex;
        }
        if (this.minerPubKeyHash) {
            obj["minerPubKeyHash"] = this.minerPubKeyHash.hex;
        }
        return obj;
    }
    toScript() {
        let buildOut = bsv.Script();
        // Add signature
        buildOut.add(this.signature.buffer);
        /* Buffer.concat([
             this.signature.toBuffer(),
             Buffer.from([sigtype & 0xff])
           ]*/
        // Add miner pub key
        buildOut.add(this.minerPubKey.buffer);
        // Add miner nonce
        buildOut.add(this.nonce.buffer);
        // Add time
        buildOut.add(this.time.buffer);
        // Add extra nonce2
        buildOut.add(this.extraNonce2.buffer);
        // Add extra nonce 1
        buildOut.add(this.extraNonce1.buffer);
        if (this.generalPurposeBits) {
            buildOut.add(this.generalPurposeBits.buffer);
        }
        if (this.minerPubKeyHash) {
            buildOut.add(this.minerPubKeyHash.buffer);
        }
        return buildOut;
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
        let signature;
        let minerPubKey;
        let time;
        let nonce;
        let extraNonce1;
        let extraNonce2;
        let minerPubKeyHash;
        let generalPurposeBits;
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
            minerPubKeyHash = new digest20_1.Digest20(script.chunks[6].buf);
        }
        else if (8 === script.chunks.length &&
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
            // generalPurposeBits
            script.chunks[6].len &&
            // minerPubKeyHash
            script.chunks[7].len) {
            generalPurposeBits = new uint32Little_1.UInt32Little(script.chunks[6].buf);
            minerPubKeyHash = new digest20_1.Digest20(script.chunks[7].buf);
        }
        else
            throw new Error('Not valid Boost Proof');
        signature = new bytes_1.Bytes(script.chunks[0].buf);
        minerPubKey = new bytes_1.Bytes(script.chunks[1].buf);
        nonce = new uint32Little_1.UInt32Little(script.chunks[2].buf);
        time = new uint32Little_1.UInt32Little(script.chunks[3].buf);
        extraNonce2 = new uint32Big_1.UInt32Big(script.chunks[4].buf);
        extraNonce1 = new uint64Big_1.UInt64Big(script.chunks[5].buf);
        return new BoostPowJobProofModel(signature, minerPubKey, time, extraNonce1, extraNonce2, nonce, minerPubKeyHash, generalPurposeBits, txid, vin, spentTxid, spentVout);
    }
    static fromHex(asm, txid, vin, spentTxid, spentVout) {
        return BoostPowJobProofModel.fromScript(new bsv.Script(asm), txid, vin, spentTxid, spentVout);
    }
    static fromASM(asm, txid, vin, spentTxid, spentVout) {
        return BoostPowJobProofModel.fromScript(new bsv.Script.fromASM(asm), txid, vin, spentTxid, spentVout);
    }
    // Optional attached information if available
    get txInpoint() {
        return {
            txid: this.Txid,
            vin: this.Vin,
        };
    }
    // Optional attached information if available
    get txid() {
        return this.Txid;
    }
    // Optional attached information if available
    get vin() {
        return this.Vin;
    }
    get spentTxid() {
        return this.SpentTxid;
    }
    // Optional attached information if available
    get spentVout() {
        return this.SpentVout;
    }
    static fromASM2(str, txid, vin) {
        return BoostPowJobProofModel.fromHex(str, txid, vin);
    }
    toString() {
        return this.toScript().toString();
    }
    toBuffer() {
        return this.toScript().toBuffer();
    }
    static fromString(str, txid, vin) {
        return BoostPowJobProofModel.fromHex(str, txid, vin);
    }
}
exports.BoostPowJobProofModel = BoostPowJobProofModel;
