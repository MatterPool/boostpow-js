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
    bits() {
        return BoostPowJobModel.difficulty2bits(this.difficulty);
    }
    static hexBitsToDifficulty(hexBits) {
        let targetHex = (hexBits.match(/../g) || []).join('');
        let targetInt = parseInt(targetHex, 16);
        return BoostPowJobModel.getDifficulty(targetInt);
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
        for (const op of BoostPowJobModel.scriptOperations()) {
            buildOut.add(op);
        }
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
    getDifficulty() {
        return this.difficulty;
    }
    static remainingOperationsMatchExactly(remainingChunks, start) {
        let i = 0;
        const expectedOps = BoostPowJobModel.scriptOperations();
        if (expectedOps.length !== (remainingChunks.length - 8)) {
            console.log('length does not match', expectedOps[i].length, remainingChunks.length);
            return false;
        }
        while (i < (remainingChunks.length - 8)) {
            // console.log(' i < ', remainingChunks.length, expectedOps[i], remainingChunks[start + i]);
            if ((
            // If it's a buffer, then ensure the value matches expect length
            remainingChunks[start + i].buf && (remainingChunks[start + i].len === expectedOps[i].length))
                ||
                    (remainingChunks[start + i].buf === undefined &&
                        expectedOps[i] === remainingChunks[start + i].opcodenum)) {
                i++;
            }
            else {
                return false;
            }
        }
        return true;
    }
    static fromHex(asm, txid, vout, value) {
        const script = new bsv.Script(asm);
        let category;
        let content;
        let diff;
        let tag;
        let additionalData;
        let userNonce;
        // console.log('script.chunks', script.chunks,  script.chunks.length);
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
    static fromASM(asm, txid, vout, value) {
        const script = new bsv.Script.fromASM(asm);
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
    static fromASM4(str, txid, vout, value) {
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
    static createRedeemTx(boostPowJob, boostPowJobProof, privateKey) {
        const boostPowString = BoostPowJobModel.tryValidateJobProof(boostPowJob, boostPowJobProof);
        /* if (!boostPowString) {
            throw new Error('createdRedeemTx: Invalid Job Proof');
        }*/
        const privateKeyObj = new bsv.PrivateKey(privateKey);
        console.log('privateKey', privateKeyObj);
        if (!boostPowJob.getTxid() ||
            (boostPowJob.getVout() === undefined || boostPowJob.getVout() === null) ||
            !boostPowJob.getValue()) {
            throw new Error('createRedeemTx: Boost Pow Job requires txid, vout, and value');
        }
        let tx = new bsv.Transaction();
        tx.addInput(new bsv.Transaction.Input({
            output: new bsv.Transaction.Output({
                script: boostPowJob.toScript(),
                satoshis: boostPowJob.getValue()
            }),
            prevTxId: boostPowJob.getTxid(),
            outputIndex: boostPowJob.getVout(),
            script: bsv.Script.empty()
        }));
        const sigtype = bsv.crypto.Signature.SIGHASH_ALL | bsv.crypto.Signature.SIGHASH_FORKID;
        const flags = bsv.Script.Interpreter.SCRIPT_VERIFY_MINIMALDATA | bsv.Script.Interpreter.SCRIPT_ENABLE_SIGHASH_FORKID | bsv.Script.Interpreter.SCRIPT_ENABLE_MAGNETIC_OPCODES | bsv.Script.Interpreter.SCRIPT_ENABLE_MONOLITH_OPCODES;
        // const signature = bsv.Transaction.sighash.sign(tx, privateKeyObj, sigtype, 0, tx.inputs[0].output.script, new bsv.crypto.BN(tx.inputs[0].output.satoshis), flags);
        return tx;
    }
    static tryValidateJobProof(boostPowJob, boostPowJobProof, debug = false) {
        const additionalDataHash = BoostPowJobModel.createBoostPowMetadata(boostPowJob, boostPowJobProof);
        if (debug) {
            console.log('BoostPowString.tryValidateJobProof');
            console.log('category', boostPowJob.getCategoryBuffer().toString('hex'), boostPowJob.getCategoryBuffer().byteLength);
            console.log('content', boostPowJob.getContentBuffer().toString('hex'), boostPowJob.getContentBuffer().byteLength);
            console.log('additionalDataHash', additionalDataHash.toBuffer().reverse().toString('hex'), additionalDataHash, additionalDataHash.hash());
            console.log('time', boostPowJobProof.getTime().toString('hex'), boostPowJobProof.getTime().byteLength);
            console.log('target', boostPowJob.getTargetAsNumberBuffer().toString('hex'), boostPowJob.getTargetAsNumberBuffer().byteLength);
            console.log('nonce', boostPowJobProof.getNonce().toString('hex'), boostPowJobProof.getNonce().byteLength);
            console.log('userNonce', boostPowJob.getUserNonceBuffer().toString('hex'), boostPowJob.getUserNonceBuffer().byteLength);
        }
        const headerBuf = Buffer.concat([
            boostPowJob.getCategoryBuffer(),
            boostPowJob.getContentBuffer(),
            additionalDataHash.hashAsBuffer().reverse(),
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
    static loopOperation(loopIterations, generateFragmentInvoker) {
        let concatOps = [];
        for (let i = 0; i < loopIterations; i++) {
            concatOps = concatOps.concat(generateFragmentInvoker());
        }
        return concatOps;
    }
    static scriptOperations() {
        return [
            // CAT SWAP
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            // {5} ROLL DUP TOALTSTACK CAT                // copy mining pool’s pubkey hash to alt stack. A copy remains on the stack.
            bsv.Opcode.OP_5,
            bsv.Opcode.OP_ROLL,
            bsv.Opcode.OP_DUP,
            bsv.Opcode.OP_TOALTSTACK,
            bsv.Opcode.OP_CAT,
            // {2} PICK TOALTSTACK                         // copy target and push to altstack.
            bsv.Opcode.OP_2,
            bsv.Opcode.OP_PICK,
            bsv.Opcode.OP_TOALTSTACK,
            // {5} ROLL SIZE {4} EQUALVERIFY CAT          // check size of extra_nonce_1
            bsv.Opcode.OP_5,
            bsv.Opcode.OP_ROLL,
            bsv.Opcode.OP_SIZE,
            bsv.Opcode.OP_4,
            bsv.Opcode.OP_EQUALVERIFY,
            bsv.Opcode.OP_CAT,
            // {5} ROLL SIZE {8} EQUALVERIFY CAT          // check size of extra_nonce_2
            bsv.Opcode.OP_5,
            bsv.Opcode.OP_ROLL,
            bsv.Opcode.OP_SIZE,
            bsv.Opcode.OP_8,
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
            // SWAP SIZE {4} EQUALVERIFY CAT             // check size of nonce. Boost POW string is constructed.
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_SIZE,
            bsv.Opcode.OP_4,
            bsv.Opcode.OP_EQUALVERIFY,
            bsv.Opcode.OP_CAT,
            // Take hash of work string and ensure that it is positive and minimally encoded.
            bsv.Opcode.OP_HASH256, ...BoostPowJobModel.loopOperation(8, BoostPowJobModel.positive_minimal_32),
            bsv.Opcode.OP_FROMALTSTACK, ...BoostPowJobModel.expand_target(), ...BoostPowJobModel.loopOperation(8, BoostPowJobModel.positive_minimal_32),
            // check that the hash of the Boost POW string is less than the target
            bsv.Opcode.OP_LESSTHAN,
            bsv.Opcode.OP_VERIFY,
            // check that the given address matches the pubkey and check signature.
            // DUP HASH160 FROMALTSTACK EQUALVERIFY CHECKSIG
            bsv.Opcode.OP_DUP,
            bsv.Opcode.OP_HASH160,
            bsv.Opcode.OP_FROMALTSTACK,
            bsv.Opcode.OP_EQUALVERIFY,
            bsv.Opcode.OP_CHECKSIG,
        ];
    }
    /*
    expand_target - transforms the uint32 exponential (compact) format for the difficulty target into the full uint256 value.
    */
    static expand_target() {
        return [
            bsv.Opcode.OP_SIZE,
            bsv.Opcode.OP_4,
            bsv.Opcode.OP_EQUALVERIFY,
            bsv.Opcode.OP_3,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_DUP,
            bsv.Opcode.OP_3,
            Buffer.from('21', 'hex'),
            bsv.Opcode.OP_WITHIN,
            bsv.Opcode.OP_VERIFY,
            bsv.Opcode.OP_TOALTSTACK,
            bsv.Opcode.OP_DUP,
            bsv.Opcode.OP_NOTIF,
            bsv.Opcode.OP_FALSE,
            bsv.Opcode.OP_RETURN,
            bsv.Opcode.OP_ENDIF,
            bsv.Opcode.OP_DUP,
            bsv.Opcode.OP_0,
            bsv.Opcode.OP_LESSTHAN,
            bsv.Opcode.OP_VERIFY,
            Buffer.from('0000000000000000000000000000000000000000000000000000000000', 'hex'),
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_FROMALTSTACK,
            bsv.Opcode.OP_3,
            bsv.Opcode.OP_SUB,
            bsv.Opcode.OP_8,
            bsv.Opcode.OP_MUL,
            bsv.Opcode.OP_RSHIFT,
        ];
    }
    /*
    Numbers in Bitcoin script are in little endian and the last bit is a sign bit. However, the target and the hash digest are both supposed to be positive numbers. Thus, we have to attach an extra byte of zeros to numbers if they would be treated as negative in Bitcoin script.
    In addition, there is a policy (ie, non-consensus rule) which says that numbers must be minimally-encoded, meaning that they cannot have unnecessary bytes of zeros at the end. Thus we must remove extra bytes of zeros. We repeat one line in the function below for as many bytes of zeros as we think we need to worry about. Any number of repetitions is considered to be a valid Boost POW script. This policy was invented by the Core developers as a way to protect against maleation attacks. It has no purpose now that the network handles 0-conf transactions and will no longer be enforced eventually. At that point the standard number of repetitions will be zero.
    positive_minimal_32 removes zero bytes from the end of a number and attaches one zero byte to negative numbers, making them positive.
    // repeat this next line as many times as needed
     */
    static positive_minimal_32() {
        return [
            bsv.Opcode.OP_SIZE,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SUB,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_DUP,
            ...BoostPowJobModel.check_positive_zero(),
            bsv.Opcode.OP_IF,
            bsv.Opcode.OP_DROP,
            bsv.Opcode.OP_ELSE,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_ENDIF,
            bsv.Opcode.OP_0,
            bsv.Opcode.OP_LESSTHAN,
            bsv.Opcode.OP_IF,
            Buffer.from('00', 'hex'),
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_ENDIF
        ];
    }
    // check_positive_zero looks at the top element of the stack and replaces it
    // with true if it is positive zero (as opposed to negative zero) and false if it is not.
    static check_positive_zero() {
        return [
            bsv.Opcode.OP_DUP,
            bsv.Opcode.OP_NOTIF,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_RSHIFT,
            bsv.Opcode.OP_NOTIF,
            bsv.Opcode.OP_TRUE,
            bsv.Opcode.OP_ELSE,
            bsv.Opcode.OP_FALSE,
            bsv.Opcode.OP_ENDIF,
            bsv.Opcode.OP_ELSE,
            bsv.Opcode.OP_FALSE,
            bsv.Opcode.OP_ENDIF
        ];
    }
    // reverse endianness. Cuz why not?
    static reverse32() {
        return [
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
        ];
    }
}
exports.BoostPowJobModel = BoostPowJobModel;
