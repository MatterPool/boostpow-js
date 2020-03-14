"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bsv = require("bsv");
const boost_pow_string_model_1 = require("./boost-pow-string-model");
const boost_pow_metadata_model_1 = require("./boost-pow-metadata-model");
const boost_utils_1 = require("./boost-utils");
class BoostPowJobModel {
    constructor(content, difficulty, category, tag, additionalData, userNonce, 
    // Optional tx information attached or not
    txid, vout, value) {
        this.content = content;
        this.difficulty = difficulty;
        this.category = category;
        this.tag = tag;
        this.additionalData = additionalData;
        this.userNonce = userNonce;
        this.txid = txid;
        this.vout = vout;
        this.value = value;
    }
    trimBufferString(str, trimLeadingNulls = true) {
        const content = Buffer.from(str, 'hex').toString('utf8');
        if (trimLeadingNulls) {
            return content.replace(/\0/g, '');
        }
        else {
            return content;
        }
    }
    getContentBuffer() {
        return this.content;
    }
    getContentString(trimLeadingNulls = true) {
        return this.trimBufferString(this.toObject().content, trimLeadingNulls);
    }
    getContentHex() {
        return (this.content.toString('hex').match(/../g) || []).reverse().join('');
    }
    getDiff() {
        return this.difficulty;
    }
    getCategoryBuffer() {
        return this.category;
    }
    getCategoryNumber() {
        return parseInt(this.getCategoryHex(), 16);
    }
    getCategoryHex() {
        return (this.category.toString('hex').match(/../g) || []).reverse().join('');
    }
    getCategoryString(trimLeadingNulls = true) {
        return this.trimBufferString(this.toObject().category, trimLeadingNulls);
    }
    getTagString(trimLeadingNulls = true) {
        return this.trimBufferString(this.toObject().tag, trimLeadingNulls);
    }
    getTagHex() {
        return (this.tag.toString('hex').match(/../g) || []).reverse().join('');
    }
    getTagBuffer() {
        return this.tag;
    }
    getAdditionalDataString(trimLeadingNulls = true) {
        return this.trimBufferString(this.toObject().additionalData, trimLeadingNulls);
    }
    getAdditionalDataHex() {
        return (this.additionalData.toString('hex').match(/../g) || []).reverse().join('');
    }
    getAdditionalDataBuffer() {
        return this.additionalData;
    }
    getUserNonce() {
        return parseInt(this.toObject().userNonce, 16);
    }
    getUserNonceNumber() {
        return parseInt(this.getUserNonceHex(), 16);
    }
    getUserNonceBuffer() {
        return this.userNonce;
    }
    getUserNonceHex() {
        return (this.userNonce.toString('hex').match(/../g) || []).reverse().join('');
    }
    static fromObject(params) {
        if (params.content && params.content.length > 64) {
            throw new Error('content too large. Max 32 bytes.');
        }
        if (params.diff <= 0 || isNaN(params.diff) || (typeof params.diff !== 'number')) {
            throw new Error('diff must be a number starting at 1. Max 4 bytes.');
        }
        if (params.category && params.category.length > 8) {
            throw new Error('category too large. Max 4 bytes.');
        }
        if (params.tag && params.tag.length > 40) {
            throw new Error('tag too large. Max 20 bytes.');
        }
        if (params.userNonce && params.userNonce.length > 8) {
            throw new Error('userNonce too large. Max 4 bytes.');
        }
        if (params.additionalData && params.additionalData.length > 64) {
            throw new Error('additionalData too large. Max 32 bytes.');
        }
        return new BoostPowJobModel(boost_utils_1.BoostUtils.createBufferAndPad(params.content, 32), params.diff, boost_utils_1.BoostUtils.createBufferAndPad(params.category, 4), boost_utils_1.BoostUtils.createBufferAndPad(params.tag, 20), boost_utils_1.BoostUtils.createBufferAndPad(params.additionalData, 32), boost_utils_1.BoostUtils.createBufferAndPad(params.userNonce, 4));
    }
    getBits() {
        return BoostPowJobModel.difficulty2bits(this.difficulty);
    }
    getBitsHex() {
        return this.getTargetAsNumberHex();
    }
    toObject() {
        return {
            content: (this.content.toString('hex').match(/../g) || []).reverse().join(''),
            diff: this.difficulty,
            category: (this.category.toString('hex').match(/../g) || []).reverse().join(''),
            tag: (this.tag.toString('hex').match(/../g) || []).reverse().join(''),
            additionalData: (this.additionalData.toString('hex').match(/../g) || []).reverse().join(''),
            userNonce: (this.userNonce.toString('hex').match(/../g) || []).reverse().join(''),
        };
    }
    static difficulty2bits(difficulty) {
        if (difficulty < 0)
            throw 'difficulty cannot be negative';
        if (!isFinite(difficulty)) {
            throw 'difficulty cannot be infinite';
        }
        for (var shiftBytes = 1; true; shiftBytes++) {
            var word = (0x00ffff * Math.pow(0x100, shiftBytes)) / difficulty;
            if (word >= 0xffff)
                break;
        }
        word &= 0xffffff; // convert to int < 0xffffff
        var size = 0x1d - shiftBytes;
        // the 0x00800000 bit denotes the sign, so if it is already set, divide the
        // mantissa by 0x100 and increase the size by a byte
        if (word & 0x800000) {
            word >>= 8;
            size++;
        }
        if ((word & ~0x007fffff) != 0)
            throw 'the \'bits\' \'word\' is out of bounds';
        if (size > 0xff)
            throw 'the \'bits\' \'size\' is out of bounds';
        var bits = (size << 24) | word;
        return bits;
    }
    getTargetAsNumberHex() {
        const i = BoostPowJobModel.difficulty2bits(this.difficulty);
        return Buffer.from(i.toString(16), 'hex').toString('hex');
    }
    getTargetAsNumberBuffer() {
        const i = BoostPowJobModel.difficulty2bits(this.difficulty);
        return Buffer.from(i.toString(16), 'hex').reverse();
    }
    getId() {
        return this.getScriptHash();
    }
    toHex() {
        return this.toScript(true);
    }
    toScript(isHex = false) {
        let buildOut = bsv.Script();
        buildOut.add(Buffer.from('boostpow', 'utf8'));
        buildOut.add(bsv.Opcode.OP_DROP);
        buildOut.add(this.category);
        buildOut.add(this.content);
        buildOut.add(this.getTargetAsNumberBuffer());
        buildOut.add(this.tag);
        buildOut.add(this.userNonce);
        buildOut.add(this.additionalData);
        // Add the rest of the script
        for (const op of BoostPowJobModel.operations) {
            buildOut.add(op);
        }
        const hex = buildOut.toHex();
        const fromhex = bsv.Script.fromHex(hex);
        const hexIso = fromhex.toHex();
        if (hex != hexIso) {
            throw new Error('Not isomorphic');
        }
        if (isHex) {
            return hexIso;
        }
        // Return script
        return buildOut;
    }
    /**
     * Returns the target difficulty for this block
     * @param {Number} bits
     * @returns {BN} An instance of BN with the decoded difficulty bits
     */
    static getTargetDifficulty(bits) {
        var target = new bsv.crypto.BN(bits & 0xffffff);
        var mov = 8 * ((bits >>> 24) - 3);
        while (mov-- > 0) {
            target = target.mul(new bsv.crypto.BN(2));
        }
        return target;
    }
    // https://bitcoin.stackexchange.com/questions/30467/what-are-the-equations-to-convert-between-bits-and-difficulty
    /**
     * @link https://en.bitcoin.it/wiki/Difficulty
     * @return {Number}
     */
    static getDifficulty(bits) {
        var GENESIS_BITS = 0x1d00ffff;
        var difficulty1TargetBN = BoostPowJobModel.getTargetDifficulty(GENESIS_BITS).mul(new bsv.crypto.BN(Math.pow(10, 8)));
        var currentTargetBN = BoostPowJobModel.getTargetDifficulty(bits);
        var difficultyString = difficulty1TargetBN.div(currentTargetBN).toString(10);
        var decimalPos = difficultyString.length - 8;
        difficultyString = difficultyString.slice(0, decimalPos) + '.' + difficultyString.slice(decimalPos);
        return parseFloat(difficultyString);
    }
    static remainingOperationsMatchExactly(remainingChunks, start) {
        if (78 !== remainingChunks.length) {
            return false;
        }
        return (
        // BEGIN
        // CAT SWAP
        remainingChunks[start + 0].opcodenum === bsv.Opcode.OP_CAT &&
            remainingChunks[start + 1].opcodenum === bsv.Opcode.OP_SWAP &&
            // {5} ROLL DUP TOALTSTACK CAT                // copy mining pool’s pubkey hash to alt stack
            remainingChunks[start + 2].opcodenum === bsv.Opcode.OP_5 &&
            remainingChunks[start + 3].opcodenum === bsv.Opcode.OP_ROLL &&
            remainingChunks[start + 4].opcodenum === bsv.Opcode.OP_DUP &&
            remainingChunks[start + 5].opcodenum === bsv.Opcode.OP_TOALTSTACK &&
            remainingChunks[start + 6].opcodenum === bsv.Opcode.OP_CAT &&
            // {2} PICK expand_target TOALTSTACK          // target to alt stack.
            remainingChunks[start + 7].opcodenum === bsv.Opcode.OP_2 &&
            remainingChunks[start + 8].opcodenum === bsv.Opcode.OP_PICK &&
            remainingChunks[start + 9].opcodenum === bsv.Opcode.OP_SIZE &&
            remainingChunks[start + 10].opcodenum === bsv.Opcode.OP_4 &&
            remainingChunks[start + 11].opcodenum === bsv.Opcode.OP_EQUALVERIFY &&
            remainingChunks[start + 12].opcodenum === bsv.Opcode.OP_3 &&
            remainingChunks[start + 13].opcodenum === bsv.Opcode.OP_SPLIT &&
            remainingChunks[start + 14].opcodenum === bsv.Opcode.OP_DUP &&
            remainingChunks[start + 15].opcodenum === bsv.Opcode.OP_3 &&
            remainingChunks[start + 16].opcodenum === bsv.Opcode.OP_GREATERTHANOREQUAL &&
            remainingChunks[start + 17].opcodenum === bsv.Opcode.OP_VERIFY &&
            remainingChunks[start + 18].opcodenum === bsv.Opcode.OP_DUP &&
            remainingChunks[start + 19].buf &&
            remainingChunks[start + 19].buf.length === 1 &&
            remainingChunks[start + 19].buf.toString('hex') === '20' &&
            remainingChunks[start + 20].opcodenum === bsv.Opcode.OP_LESSTHANOREQUAL &&
            remainingChunks[start + 21].opcodenum === bsv.Opcode.OP_VERIFY &&
            remainingChunks[start + 22].opcodenum === bsv.Opcode.OP_TOALTSTACK &&
            remainingChunks[start + 23].buf &&
            remainingChunks[start + 23].buf.length === 29 &&
            remainingChunks[start + 23].buf.toString('hex') === '0000000000000000000000000000000000000000000000000000000000' &&
            remainingChunks[start + 24].opcodenum === bsv.Opcode.OP_CAT &&
            remainingChunks[start + 25].opcodenum === bsv.Opcode.OP_FROMALTSTACK &&
            remainingChunks[start + 26].opcodenum === bsv.Opcode.OP_3 &&
            remainingChunks[start + 27].opcodenum === bsv.Opcode.OP_SUB &&
            remainingChunks[start + 28].opcodenum === bsv.Opcode.OP_RSHIFT &&
            remainingChunks[start + 29].opcodenum === bsv.Opcode.OP_TOALTSTACK &&
            // {5} ROLL SIZE {4} EQUALVERIFY CAT          // check size of extra_nonce_1
            remainingChunks[start + 30].opcodenum === bsv.Opcode.OP_5 &&
            remainingChunks[start + 31].opcodenum === bsv.Opcode.OP_ROLL &&
            remainingChunks[start + 32].opcodenum === bsv.Opcode.OP_SIZE &&
            remainingChunks[start + 33].opcodenum === bsv.Opcode.OP_4 &&
            remainingChunks[start + 34].opcodenum === bsv.Opcode.OP_EQUALVERIFY &&
            remainingChunks[start + 35].opcodenum === bsv.Opcode.OP_CAT &&
            // {5} ROLL SIZE {4} EQUALVERIFY CAT          // check size of extra_nonce_2
            remainingChunks[start + 36].opcodenum === bsv.Opcode.OP_5 &&
            remainingChunks[start + 37].opcodenum === bsv.Opcode.OP_ROLL &&
            remainingChunks[start + 38].opcodenum === bsv.Opcode.OP_SIZE &&
            remainingChunks[start + 39].opcodenum === bsv.Opcode.OP_4 &&
            remainingChunks[start + 40].opcodenum === bsv.Opcode.OP_EQUALVERIFY &&
            remainingChunks[start + 41].opcodenum === bsv.Opcode.OP_CAT &&
            // SWAP CAT HASH256                           // create metadata string and hash it.
            remainingChunks[start + 42].opcodenum === bsv.Opcode.OP_SWAP &&
            remainingChunks[start + 43].opcodenum === bsv.Opcode.OP_CAT &&
            remainingChunks[start + 44].opcodenum === bsv.Opcode.OP_HASH256 &&
            // SWAP TOALTSTACK CAT CAT                    // target to altstack.
            remainingChunks[start + 45].opcodenum === bsv.Opcode.OP_SWAP &&
            remainingChunks[start + 46].opcodenum === bsv.Opcode.OP_TOALTSTACK &&
            remainingChunks[start + 47].opcodenum === bsv.Opcode.OP_CAT &&
            remainingChunks[start + 48].opcodenum === bsv.Opcode.OP_CAT &&
            // SWAP SIZE {4} EQUALVERIFY CAT              // check size of timestamp.
            remainingChunks[start + 49].opcodenum === bsv.Opcode.OP_SWAP &&
            remainingChunks[start + 50].opcodenum === bsv.Opcode.OP_SIZE &&
            remainingChunks[start + 51].opcodenum === bsv.Opcode.OP_4 &&
            remainingChunks[start + 52].opcodenum === bsv.Opcode.OP_EQUALVERIFY &&
            remainingChunks[start + 53].opcodenum === bsv.Opcode.OP_CAT &&
            // FROMALTSTACK CAT                           // attach target
            remainingChunks[start + 54].opcodenum === bsv.Opcode.OP_FROMALTSTACK &&
            remainingChunks[start + 55].opcodenum === bsv.Opcode.OP_CAT &&
            // SWAP SIZE {4} EQUALVERIFY CAT              // check size of nonce
            remainingChunks[start + 56].opcodenum === bsv.Opcode.OP_SWAP &&
            remainingChunks[start + 57].opcodenum === bsv.Opcode.OP_SIZE &&
            remainingChunks[start + 58].opcodenum === bsv.Opcode.OP_4 &&
            remainingChunks[start + 59].opcodenum === bsv.Opcode.OP_EQUALVERIFY &&
            remainingChunks[start + 60].opcodenum === bsv.Opcode.OP_CAT &&
            // check that the hash of the title is less than the target
            // HASH256 FROMALTSTACK LESSTHAN VERIFY
            remainingChunks[start + 61].opcodenum === bsv.Opcode.OP_HASH256 &&
            remainingChunks[start + 62].opcodenum === bsv.Opcode.OP_FROMALTSTACK &&
            remainingChunks[start + 63].opcodenum === bsv.Opcode.OP_LESSTHAN &&
            remainingChunks[start + 64].opcodenum === bsv.Opcode.OP_VERIFY &&
            // check that the given address matches the pubkey and check signature.
            // DUP HASH256 FROMALTSTACK EQUALVERIFY CHECKSIG
            remainingChunks[start + 65].opcodenum === bsv.Opcode.OP_DUP &&
            remainingChunks[start + 66].opcodenum === bsv.Opcode.OP_HASH256 &&
            remainingChunks[start + 67].opcodenum === bsv.Opcode.OP_FROMALTSTACK &&
            remainingChunks[start + 68].opcodenum === bsv.Opcode.OP_EQUALVERIFY &&
            remainingChunks[start + 69].opcodenum === bsv.Opcode.OP_CHECKSIG);
    }
    static fromHex(asm, txid, vout, value) {
        const script = new bsv.Script(asm);
        let category;
        let content;
        let diff;
        let tag;
        let additionalData;
        let userNonce;
        if (
        // boostv01
        script.chunks[0].buf.toString('utf8') === 'boostpow' &&
            // Drop the identifier
            script.chunks[1].opcodenum === bsv.Opcode.OP_DROP &&
            // Category
            script.chunks[2].buf &&
            script.chunks[2].opcodenum === 4 &&
            // Content
            script.chunks[3].buf &&
            script.chunks[3].len === 32 &&
            // Target
            script.chunks[4].buf &&
            script.chunks[4].len === 4 &&
            // Tag
            script.chunks[5].buf &&
            script.chunks[5].len === 20 &&
            // User Nonce
            script.chunks[6].buf &&
            script.chunks[6].len === 4 &&
            // Additional Data
            script.chunks[7].buf &&
            script.chunks[7].len === 32 &&
            BoostPowJobModel.remainingOperationsMatchExactly(script.chunks, 8)) {
            category = script.chunks[2].buf;
            content = script.chunks[3].buf;
            let targetHex = (script.chunks[4].buf.toString('hex').match(/../g) || []).reverse().join('');
            let targetInt = parseInt(targetHex, 16);
            diff = BoostPowJobModel.getDifficulty(targetInt);
            tag = script.chunks[5].buf;
            //tag = (script.chunks[5].buf.toString('hex').match(/../g) || []).reverse().join('');
            userNonce = script.chunks[6].buf;
            //userNonce = (script.chunks[6].buf.toString('hex').match(/../g) || []).reverse().join('');
            additionalData = script.chunks[7].buf;
            //additionalData = (script.chunks[7].buf.toString('hex').match(/../g) || []).reverse().join('');
            return new BoostPowJobModel(content, diff, category, tag, additionalData, userNonce, txid, vout, value);
        }
        throw new Error('Not valid Boost Output');
    }
    toASM() {
        const makeHex = this.toHex();
        const makeAsm = new bsv.Script(makeHex);
        return makeAsm.toASM();
    }
    static fromASM(str, txid, vout, value) {
        return BoostPowJobModel.fromHex(str, txid, vout, value);
    }
    static fromASM2(str, txid, vout, value) {
        return BoostPowJobModel.fromHex(str, txid, vout, value);
    }
    toString() {
        const makeHex = this.toHex();
        const makeAsm = new bsv.Script(makeHex);
        return makeAsm.toString();
    }
    static fromString(str, txid, vout, value) {
        return BoostPowJobModel.fromHex(str, txid, vout, value);
    }
    static fromScript(script, txid, vout, value) {
        return BoostPowJobModel.fromHex(script, txid, vout, value);
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
    getScriptHash() {
        const hex = this.toHex();
        const buffer = Buffer.from(hex, 'hex');
        return bsv.crypto.Hash.sha256(buffer).reverse().toString('hex');
    }
    static fromTransaction(tx) {
        if (!tx) {
            return undefined;
        }
        let o = 0;
        for (const out of tx.outputs) {
            if (out.script && out.script.chunks[0].buf && out.script.chunks[0].buf.toString('hex') === Buffer.from('boostpow', 'utf8').toString('hex')) {
                return BoostPowJobModel.fromScript(out.script, tx.hash, o, out.satoshis);
            }
            o++;
        }
        return undefined;
    }
    static fromRawTransaction(rawtx) {
        if (!rawtx || rawtx === '') {
            return undefined;
        }
        const tx = new bsv.Transaction(rawtx);
        return BoostPowJobModel.fromTransaction(tx);
    }
    static createBoostPowMetadata(boostPowJob, boostPowJobProof) {
        return boost_pow_metadata_model_1.BoostPowMetadataModel.fromBuffer({
            tag: boostPowJob.getTagBuffer(),
            minerPubKeyHash: boostPowJobProof.getMinerPubKeyHash(),
            extraNonce1: boostPowJobProof.getExtraNonce1(),
            extraNonce2: boostPowJobProof.getExtraNonce2(),
            userNonce: boostPowJob.getUserNonceBuffer(),
            additionalData: boostPowJob.getAdditionalDataBuffer(),
        });
    }
    static tryValidateJobProof(boostPowJob, boostPowJobProof, debug = false) {
        const additionalDataHash = BoostPowJobModel.createBoostPowMetadata(boostPowJob, boostPowJobProof);
        if (debug) {
            console.log('BoostPowString.tryValidateJobProof');
            console.log('category', boostPowJob.getCategoryBuffer().toString('hex'), boostPowJob.getCategoryBuffer().byteLength);
            console.log('content', boostPowJob.getContentBuffer().toString('hex'), boostPowJob.getContentBuffer().byteLength);
            console.log('additionalDataHash', additionalDataHash, additionalDataHash.hash());
            console.log('time', boostPowJobProof.getTime().toString('hex'), boostPowJobProof.getTime().byteLength);
            console.log('target', boostPowJob.getTargetAsNumberBuffer().toString('hex'), boostPowJob.getTargetAsNumberBuffer().byteLength);
            console.log('nonce', boostPowJobProof.getNonce().toString('hex'), boostPowJobProof.getNonce().byteLength);
            console.log('userNonce', boostPowJob.getUserNonceBuffer().toString('hex'), boostPowJob.getUserNonceBuffer().byteLength);
        }
        const headerBuf = Buffer.concat([
            boostPowJob.getCategoryBuffer(),
            boostPowJob.getContentBuffer(),
            additionalDataHash.hashAsBuffer(),
            // Buffer.from('0e60651a9934e8f0decd1c5fde39309e48fca0cd1c84a21ddfde95033762d86c', 'hex').reverse(), // additionalDataHash.hashAsBuffer(),
            boostPowJobProof.getTime(),
            boostPowJob.getTargetAsNumberBuffer(),
            boostPowJobProof.getNonce(),
        ]);
        const blockHeader = bsv.BlockHeader.fromBuffer(headerBuf);
        if (debug) {
            console.log('boostHeader candidate', headerBuf.toString('hex'), blockHeader);
        }
        if (blockHeader.validProofOfWork()) {
            if (debug) {
                console.log('BoostPowString.tryValidateJobProof is valid');
            }
            return new boost_pow_string_model_1.BoostPowStringModel(blockHeader);
        }
        if (debug) {
            console.log('BoostPowString.tryValidateJobProof is invalid');
        }
        return null;
    }
}
// Start of Boost Output after push datas
BoostPowJobModel.operations = [
    // BEGIN
    // CAT SWAP
    bsv.Opcode.OP_CAT,
    bsv.Opcode.OP_SWAP,
    // {5} ROLL DUP TOALTSTACK CAT                // copy mining pool’s pubkey hash to alt stack
    bsv.Opcode.OP_5,
    bsv.Opcode.OP_ROLL,
    bsv.Opcode.OP_DUP,
    bsv.Opcode.OP_TOALTSTACK,
    bsv.Opcode.OP_CAT,
    // {2} PICK expand_target TOALTSTACK          // target to alt stack.
    bsv.Opcode.OP_2,
    bsv.Opcode.OP_PICK,
    // Expand Target
    bsv.Opcode.OP_SIZE,
    bsv.Opcode.OP_4,
    bsv.Opcode.OP_EQUALVERIFY,
    bsv.Opcode.OP_3,
    bsv.Opcode.OP_SPLIT,
    bsv.Opcode.OP_DUP,
    bsv.Opcode.OP_3,
    bsv.Opcode.OP_GREATERTHANOREQUAL,
    bsv.Opcode.OP_VERIFY,
    bsv.Opcode.OP_DUP,
    1,
    32,
    bsv.Opcode.OP_LESSTHANOREQUAL,
    bsv.Opcode.OP_VERIFY,
    bsv.Opcode.OP_TOALTSTACK,
    Buffer.from('0000000000000000000000000000000000000000000000000000000000', 'hex'),
    bsv.Opcode.OP_CAT,
    bsv.Opcode.OP_FROMALTSTACK,
    bsv.Opcode.OP_3,
    bsv.Opcode.OP_SUB,
    bsv.Opcode.OP_RSHIFT,
    // Expand target end
    bsv.Opcode.OP_TOALTSTACK,
    // {5} ROLL SIZE {4} EQUALVERIFY CAT          // check size of extra_nonce_1
    bsv.Opcode.OP_5,
    bsv.Opcode.OP_ROLL,
    bsv.Opcode.OP_SIZE,
    bsv.Opcode.OP_4,
    bsv.Opcode.OP_EQUALVERIFY,
    bsv.Opcode.OP_CAT,
    // {5} ROLL SIZE {4} EQUALVERIFY CAT          // check size of extra_nonce_2
    bsv.Opcode.OP_5,
    bsv.Opcode.OP_ROLL,
    bsv.Opcode.OP_SIZE,
    bsv.Opcode.OP_4,
    bsv.Opcode.OP_EQUALVERIFY,
    bsv.Opcode.OP_CAT,
    // SWAP CAT HASH256                           // create metadata string and hash it.
    bsv.Opcode.OP_SWAP,
    bsv.Opcode.OP_CAT,
    bsv.Opcode.OP_HASH256,
    // SWAP TOALTSTACK CAT CAT                    // target to altstack.
    bsv.Opcode.OP_SWAP,
    bsv.Opcode.OP_TOALTSTACK,
    bsv.Opcode.OP_CAT,
    bsv.Opcode.OP_CAT,
    // SWAP SIZE {4} EQUALVERIFY CAT              // check size of timestamp.
    bsv.Opcode.OP_SWAP,
    bsv.Opcode.OP_SIZE,
    bsv.Opcode.OP_4,
    bsv.Opcode.OP_EQUALVERIFY,
    bsv.Opcode.OP_CAT,
    // FROMALTSTACK CAT                           // attach target
    bsv.Opcode.OP_FROMALTSTACK,
    bsv.Opcode.OP_CAT,
    // SWAP SIZE {4} EQUALVERIFY CAT              // check size of nonce
    bsv.Opcode.OP_SWAP,
    bsv.Opcode.OP_SIZE,
    bsv.Opcode.OP_4,
    bsv.Opcode.OP_EQUALVERIFY,
    bsv.Opcode.OP_CAT,
    // check that the hash of the title is less than the target
    // HASH256 FROMALTSTACK LESSTHAN VERIFY
    bsv.Opcode.OP_HASH256,
    bsv.Opcode.OP_FROMALTSTACK,
    bsv.Opcode.OP_LESSTHAN,
    bsv.Opcode.OP_VERIFY,
    // check that the given address matches the pubkey and check signature.
    // DUP HASH256 FROMALTSTACK EQUALVERIFY CHECKSIG
    bsv.Opcode.OP_DUP,
    bsv.Opcode.OP_HASH256,
    bsv.Opcode.OP_FROMALTSTACK,
    bsv.Opcode.OP_EQUALVERIFY,
    bsv.Opcode.OP_CHECKSIG,
];
exports.BoostPowJobModel = BoostPowJobModel;
